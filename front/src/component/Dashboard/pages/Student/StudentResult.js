import React, { useEffect, useState } from 'react'
import URL from '../../../UI/URL'
import LoadingIndicator from '../../../common/LoadingIndicator'
import ErrorMessage from '../../../common/ErrorMessage'
import { Card } from 'primereact/card'
import { useLocation } from 'react-router-dom'

function StudentResult({studentId}) {
    const [students,setStudents] = useState([])
    const [exams,setExams] = useState([])
    const [months,setMonths] = useState([])
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState('')
    const location = useLocation()
    const {first,middle,last} = location.state || {}

    useEffect(()=>{
        const fetchStudentResult = async ()=>{
            try {
                setLoading(true)
                const response = await fetch(`${URL()}/score/student/${studentId}`);
                const json = await response.json()
                if(response.ok){
                    setStudents(json.students)
                    setExams(json.exams)
                    setMonths(json.months)
                }else{
                    setError(json.error)
                } 
            } catch (error) {
                setError(error.message)
            }finally{
                setLoading(false)
            }   
        }
        fetchStudentResult()
    },[studentId])

    if(loading){
        return <LoadingIndicator/>
    }
    if(error){
        return <ErrorMessage error={error}/>
    }
   
    const MainHeader = ()=>(
        <tr>
            <th rowSpan={2} className='w-2rem'>No.</th>
            <th rowSpan={2} className='w-10rem'>Subject</th>
            {months.map((month,index)=>(
                <th key={month+index} colSpan={exams.filter(exam=>exam.month === month).length}  className='text-center'>{month}</th>
            ))}
            <th colSpan={2} className='text-center'>Final</th>
        </tr>
        )

    const SubHeader = ()=>(
        <tr>
        {months.map(month=>(
            exams
                .filter(exam=>exam.month === month)
                .map(exam=>(
                    <th key={exam.round} className='w-2rem'>{`${exam.description}(${exam.outOf})`}<br/> Eval: {exam.round}</th>
                ))
            )
        )}
        <th className='w-2rem'>Sum</th>
        <th className='w-3rem'>Ave.</th>
        </tr>


    )
    const RenderRow = ()=>
        {
           const oneStudent = students.reduce((acc, student) => {
                const subjectName = student.subjects.name
                if(!acc[subjectName]){
                    acc[subjectName] = {
                        subjects:student.subjects,
                        scoresByMonth:{},
                        scores: []
                    }
                }
                const month = new Date(student.date).toLocaleString('default', { month: 'long' });
                if (!acc[subjectName].scoresByMonth[month]) {
                    acc[subjectName].scoresByMonth[month] = {}; 
                }

                const examKey = `${student.description}-${student.outOf}-${student.round}-${month}`;
                acc[subjectName].scoresByMonth[month][examKey] = student.value;
                acc[subjectName].scores.push({ value: student.value, outOf: student.outOf });
                return acc;

            },{})

            return Object.values(oneStudent).map((subject,index) => {
                const sum = subject.scores.reduce((total, scoreObj) => total + scoreObj.value, 0);
                const OutOfSum = subject.scores.reduce((total,scoreObj)=>total + scoreObj.outOf,0)

                const weightedSum = subject.scores.reduce((total, scoreObj) => total + (scoreObj.value / scoreObj.outOf), 0);
                const average = ((weightedSum / subject.scores.length) * 100).toFixed(2); 

                return (
                    <tr key={subject.subjects._id}>
                        <td>{index+1}</td>
                        <td>{subject.subjects.name}</td>
                        {months.map(month => 
                            exams
                                .filter(exam => exam.month === month)
                                .map((exam, i) => {
                                    const examKey = `${exam.description}-${exam.outOf}-${exam.round}-${month}`;
                                    const score = subject.scoresByMonth[month]?.[examKey] ?? 'N/A'; // Display 'N/A' if no score
                                    return <td key={`${subject.subjects._id}-${month}-${i}`}>{score}</td>;
                                })
                        )}
                        <td>{sum}/{OutOfSum}</td>
                        <td>{average}</td>
                    </tr>
                )
            })
        }
    
  return (
    <Card title={`Marklist of Student ${first} ${middle} ${last}`} className='w-full overflow-x-auto mt-5 text-center'>
      <table>
        <thead>
            <MainHeader/>
            <SubHeader/>
        </thead>
        <tbody>
            <RenderRow/>
        </tbody>
      </table>
    </Card>
  )
}

export default StudentResult
