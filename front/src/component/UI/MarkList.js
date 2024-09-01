import React, { useEffect, useState } from 'react';
import LoadingIndicator from '../common/LoadingIndicator';
import { useLocation } from 'react-router-dom';
import ErrorMessage from '../common/ErrorMessage';


function MarkList({subjectId}) {
    const [markListInfo,setMarkListInfo] = useState([])
    const [months,setMonths] = useState([])
    const [exams,setExams] = useState([])
    const [error,setError] = useState('')
    const [loading,setLoading] = useState(false)

    const location = useLocation()
    const {grade,section, subjectName} = location.state || {}

    useEffect(()=>{
        try {
            setLoading(true)
            const fetchMarkList = async()=>{
                const response = await fetch(`http://localhost:4000/score/${subjectId}`)
                const json = await response.json()
                if(response.ok){
                    setMarkListInfo(json.scores)
                    setMonths(json.months)
                    setExams(json.exams)
                }else{
                    setError(json.error)
                }
            } 
        fetchMarkList()

        }finally{
            setLoading(false)
        }
        
    },[subjectId])


    const renderHeaders = () => (
        <tr>
            <th rowSpan={2}>No</th>
            <th rowSpan={2}>Student Name</th>
            <th rowSpan={2}>Age</th>
            <th rowSpan={2}>Sex</th>
            <th rowSpan={2}>Teacher Name</th>
            {months?.map((month,index )=> (
                <th key={index} colSpan={exams.length}>{month}</th>
            ))}
        </tr>
    );

    const renderSubHeaders = () => (
        <tr>
            {months?.map(() => (
                exams?.map((exam,index) => (
                    <th key={`${index}`}>
                        {exam.description}({exam.outOf})
                    </th>
                ))
            ))}
        </tr>

        )



        const renderRows = () => {
            const groupedScores = markListInfo.reduce((acc, info) => {
                const studentId = info.studentId._id;
                if (!acc[studentId]) {
                    acc[studentId] = {
                        student: info.studentId,
                        subject: info.subjectId,
                        teacher: info.teacherId,
                        scoresByMonth: {}
                    };
                }
                const month = new Date(info.date).toLocaleString('default', { month: 'long' });
                if (!acc[studentId].scoresByMonth[month]) {
                    acc[studentId].scoresByMonth[month] = {};
                }
                acc[studentId].scoresByMonth[month][info.description] = info.value;
                return acc;
            }, 
            {});

            return Object.values(groupedScores).map((studentData,index) => (
                <tr key={studentData.student._id}>
                    <td>{index + 1}</td>
                    <td>{studentData.student.first} {studentData.student.middle}</td>
                    <td>{studentData.student.age}</td>
                    <td>{studentData.student.gender}</td>
                    <td>{studentData.teacher.first} {studentData.teacher.middle}</td>
                    {months.map(month => (
                        exams.map(exam => (
                            <td key={`${month}-${exam.description}`}>
                                {studentData.scoresByMonth[month] ? studentData.scoresByMonth[month][exam.description] || '-' : '-'}
                            </td>
                        ))
                    ))}
                </tr>
            ));
        };
       
        return loading ? <LoadingIndicator/> : (
            <div>
                <h3 className='text-center'>Mark List of <span className='text-green-500'>{subjectName} Grade {grade}{section}</span> students</h3>
                {error ? <ErrorMessage error={error}/>:
                    <table>
                        <thead>
                            {renderHeaders()}
                            {renderSubHeaders()}
                        </thead>
                        <tbody>
                            {renderRows()}
                        </tbody>
                    </table>
                }
            </div>
        );
}

export default MarkList
