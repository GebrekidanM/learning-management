import React, { useEffect, useState } from 'react';
import LoadingIndicator from '../common/LoadingIndicator';
import { useLocation, useNavigate } from 'react-router-dom';
import ErrorMessage from '../common/ErrorMessage';
import { Card } from 'primereact/card';
import URL from './URL'

import { MdAdd , MdEdit} from "react-icons/md";

function MarkList({ subjectId }) {
    const [markListInfo, setMarkListInfo] = useState([]);
    const [months, setMonths] = useState([]);
    const [exams, setExams] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const { grade, section, subjectName } = location.state || {};

    const handleAddScore = (teacherId, studentId, first, middle) => {
        navigate(`/main?type=teacher&info=${teacherId}`, { state: { subjectId, studentId, first, middle } });
    };


    const handleUpdateScore = (teacherId, studentId, first, middle, round, scoreValue, examDescription, examOutOf) => {
        navigate(`/main?type=teacher&update_score=1`, { 
            state: { subjectId, studentId, first, middle, round, scoreValue,examDescription,examOutOf,teacherId }
        });
    };

    useEffect(() => {
        const fetchMarkList = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${URL()}/score/${subjectId}`);
                const json = await response.json();
                if (response.ok) {
                    setMarkListInfo(json.scores);
                    setMonths(json.months);
                    setExams(json.exams);
                } else {
                    setError(json.error || 'Failed to fetch mark list');
                }
            } catch (err) {
                setError('An error occurred while fetching data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMarkList();
    }, [subjectId]);
 
    const IndexGenerator = (max = 100) => Math.floor(Math.random() * max);

    const renderHeaders = () => (
        <tr>
            <th rowSpan={2} className='w-2rem'>No</th>
            <th rowSpan={2} className='w-10rem'>Student Name</th>
            <th rowSpan={2} className='w-2rem'>Age</th>
            <th rowSpan={2} className='w-3rem'>Sex</th>
            <th rowSpan={2} className='w-10rem'>Teacher Name</th>
            {months.map((month, index) => (
                <th key={index} colSpan={exams.filter(exam=>exam.month === month).length} className='text-center'>{month}</th>
            ))}
        </tr>
    );

    const renderSubHeaders = () => (
        <tr>
            {months.map((month) => (
                exams
                    .filter((exam) => exam.month === month)
                    .map((exam, index) => (
                        <th  key={`${month}-${exam.description}-${exam.outOf}-${exam.round}-${IndexGenerator()}-${index}`} className='text-xs w-4rem'>
                        {exam.description.slice(0, 3)} ({exam.outOf})<br />
                            <span className='text-xs text-yellow-500'>Eval. {exam.round}</span>
                        </th>
                    ))
            ))}
        </tr>
    );
    
    

    const renderRows = () => {
        const groupedScores = markListInfo.reduce((acc, info) => {
            const studentId = info.studentId._id;
            if (!acc[studentId]) {
                acc[studentId] = {
                    student: info.studentId,
                    subject: info.subjectId,
                    teacher: info.teacherId,
                    scoresByMonth: {},
                };
            }

            const month = new Date(info.date).toLocaleString('default', { month: 'long' });
                 // Check if there are no entries for any month in scoresByMonth
                 if (!acc[studentId].scoresByMonth[month]) {
                    acc[studentId].scoresByMonth[month] = {}; // Initialize the month if it does not exist
                }
                
                // Add the score for the specific exam identified by description, outOf, and round
                const examKey = `${info.description}-${info.outOf}-${info.round}-${month}`;
                acc[studentId].scoresByMonth[month][examKey] = info.value;
                return acc;
        }, {});

        return Object.values(groupedScores).map((studentData, index) => (
            <tr key={studentData.student._id} >
                <td>{index + 1}</td>
                <td>
                    <span className='cursor-pointer w-full flex justify-content-between align-items-center'>
                        {studentData.student.first} {studentData.student.middle} 
                        <span className='cursor-pointer' 
                              title='Add new score'
                              onClick={() => handleAddScore(studentData.teacher._id, studentData.student._id, studentData.student.first, studentData.student.middle)}>
                              {<MdAdd/>}
                        </span>
                    </span>
                </td>
                <td>{studentData.student.age}</td>
                <td>{studentData.student.gender}</td>
                <td>{studentData.teacher.first} {studentData.teacher.middle}</td>
                {months.map(month => (
                    exams
                        .filter(exam => exam.month === month)
                        .map(exam => (
                            <td 
                                key={`${studentData.student._id}-${exam.description}-${exam.outOf}-${exam.round}-${month}`}
                                className='border-1'>
                                <span className='flex justify-content-between align-items-center'>
                                    {studentData.scoresByMonth[month] &&
                                        studentData.scoresByMonth[month][`${exam.description}-${exam.outOf}-${exam.round}-${exam.month}`]
                                            ? studentData.scoresByMonth[month][`${exam.description}-${exam.outOf}-${exam.round}-${exam.month}`]
                                            : '-'
                                    }
                                    <span 
                                        title='Edit this value'
                                        onClick={() => handleUpdateScore(
                                            studentData.teacher._id,
                                            studentData.student._id,
                                            studentData.student.first,
                                            studentData.student.middle,
                                            exam.round,
                                            studentData.scoresByMonth[month][`${exam.description}-${exam.outOf}-${exam.round}-${month}`],
                                            exam.description,
                                            exam.outOf)} 
                                        className='cursor-pointer p-2 mr-0'>
                                        <MdEdit/>
                                    </span>
                                </span>
                                
                            </td>
                        ))
                ))}
            </tr>
        ));
    };

    return loading ? <LoadingIndicator /> : (
        <div>
            <h3 className='text-center p-3 '>Mark List of <span className='text-green-500'>{subjectName} Grade {grade}{section}</span> students</h3>
            {error ? <ErrorMessage error={error} /> :
            <Card className='w-full overflow-x-auto'>
                <table className='w-full'>
                    <thead>
                        {renderHeaders()}
                        {renderSubHeaders()}
                    </thead>
                    <tbody>
                        {renderRows()}
                    </tbody>
                </table>
            </Card>

            }
        </div>
    );
}

export default MarkList;
