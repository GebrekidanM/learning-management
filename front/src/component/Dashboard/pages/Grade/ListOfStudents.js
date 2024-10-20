import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import LoadingIndicator from '../../../common/LoadingIndicator';
import ErrorMessage from '../../../common/ErrorMessage';
import URL from '../../../UI/URL';

function ListOfStudents({ subjectId }) {
    const navigate = useNavigate()
    const [error, setError] = useState('');
    const [subjectInfo, setSubjectInfo] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const { teacherId } = location.state || {};

    useEffect(() => {
        let isMounted = true;
        const fetchSubject = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${URL()}/class/subject/${subjectId}`);
                const json = await response.json();
                if (response.ok && isMounted) {
                    setSubjectInfo(json.subject);
                    setStudents(json.students);
                } else if (isMounted) {
                    setError(json.error || 'Failed to fetch subject information');
                }
            } catch (error) {
                if (isMounted) {
                    setError(error.message || 'An unexpected error occurred');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };
        fetchSubject();
        return () => {
            isMounted = false;
        };
    }, [subjectId]);

    const handleAddScore = (studentId,first,middle)=>{

        navigate(`/main?type=teacher&info=${teacherId._id}`,{state:{subjectId,studentId,first,middle}})
    }

    if(loading){
        return <LoadingIndicator/>
    }
    return (
        <div className="p-4">
            {subjectInfo && (
                <Card >
                    <h2 className='p-2' >{`Mark list of Grade ${subjectInfo.sectionId.gradeId.grade}${subjectInfo.sectionId.section} ${subjectInfo.name}`}</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Full Name</th>
                                <th>Age</th>
                                <th>Sex</th>
                            </tr>
                        </thead>
                        
                        {error ? <ErrorMessage error={error}/>:
                        <tbody>
                            {students.map((student, index) => (
                                <tr 
                                    key={student._id} 
                                    onClick={() => handleAddScore(student._id,student.first,student.middle,subjectInfo.sectionId._id)} 
                                    className='transition-colors transition-duration-500 cursor-pointer hover:bg-cyan-900 hover:text-white'
                                >
                                    <td>{index + 1}</td>
                                    <td>{student.first} {student.middle} {student.last}</td>
                                    <td>{student.age}</td>
                                    <td>{student.gender}</td>
                                </tr>
                            ))}
                        </tbody>
                        }
                    </table>
                </Card>
            )}
        </div>
    );
}

export default ListOfStudents;
