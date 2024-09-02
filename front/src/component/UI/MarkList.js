import React, { useEffect, useState } from 'react';
import LoadingIndicator from '../common/LoadingIndicator';
import { useLocation, useNavigate } from 'react-router-dom';
import ErrorMessage from '../common/ErrorMessage';

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

    useEffect(() => {
        const fetchMarkList = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:4000/score/${subjectId}`);
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
            <th rowSpan={2}>No</th>
            <th rowSpan={2}>Student Name</th>
            <th rowSpan={2}>Age</th>
            <th rowSpan={2}>Sex</th>
            <th rowSpan={2}>Teacher Name</th>
            {months.map((month, index) => (
                <th key={index} colSpan={exams.length} className='text-center'>{month}</th>
            ))}
        </tr>
    );

    const renderSubHeaders = () => (
        <tr>
            {months.flatMap(month => (
                exams.map(exam => (
                    <th key={`${month}-${exam.description}-${IndexGenerator()}`}>
                        {exam.description} ({exam.outOf})
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
            if (!acc[studentId].scoresByMonth[month]) {
                acc[studentId].scoresByMonth[month] = {};
            }
            if (!acc[studentId].scoresByMonth[month][info.description]) {
                acc[studentId].scoresByMonth[month][info.description] = {};
            }
            acc[studentId].scoresByMonth[month][info.description][info.round] = info.value;
            return acc;
        }, {});

        return Object.values(groupedScores).map((studentData, index) => (
            <tr key={studentData.student._id} className='cursor-pointer' onClick={() => handleAddScore(studentData.teacher._id, studentData.student._id, studentData.student.first, studentData.student.middle)}>
                <td>{index + 1}</td>
                <td>{studentData.student.first} {studentData.student.middle}</td>
                <td>{studentData.student.age}</td>
                <td>{studentData.student.gender}</td>
                <td>{studentData.teacher.first} {studentData.teacher.middle}</td>
                {months.flatMap(month => (
                    exams.map(exam => (
                        <td key={`${studentData.student._id}-${month}-${exam.description}-${IndexGenerator()}`}>
                            {studentData.scoresByMonth[month] && studentData.scoresByMonth[month][exam.description]
                                ? Object.values(studentData.scoresByMonth[month][exam.description]).join(' | ')
                                : '-'}
                        </td>
                    ))
                ))}
            </tr>
        ));
    };

    return loading ? <LoadingIndicator /> : (
        <div>
            <h3 className='text-center'>Mark List of <span className='text-green-500'>{subjectName} Grade {grade}{section}</span> students</h3>
            {error ? <ErrorMessage error={error} /> :
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

export default MarkList;
