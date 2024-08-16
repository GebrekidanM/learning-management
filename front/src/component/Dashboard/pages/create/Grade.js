import React, { useState, useEffect } from 'react';
import style from '../css/pages.module.css';

function Grade() {
    const [grades, setGrades] = useState([]);
    const [gradeError, setGradeError] = useState('');
    const [sections, setSections] = useState([]);
    const [sectionsError, setSectionsError] = useState('');
    const [students, setStudents] = useState([]);
    const [studentsError, setStudentsError] = useState('');
    const [activeGradeId,setActiveGradeId] = useState('')
    const [activeSectionId,setActiveSectionId] = useState('')

    // Fetch grades when component mounts
    useEffect(() => {
        const fetchGrades = async () => {
            try {
                const response = await fetch('http://localhost:4000/class/grades');
                const json = await response.json();
                if (response.ok) {
                    setGrades(json);
                } else {
                    setGradeError(json.error || 'Failed to load grades');
                }
            } catch (error) {
                setGradeError('An error occurred while fetching grades: ' + error.message);
            }
        };
        fetchGrades();
    }, []);

    // Fetch sections for the selected grade
    const fetchSections = async (gradeId) => {
        setActiveGradeId(gradeId);
        setSections([]);
        setStudents([]);
        setSectionsError("")
        setStudentsError('')

        try {
            const response = await fetch(`http://localhost:4000/class/sections/${gradeId}`);
            const json = await response.json();
            if (response.ok) {
                setSections(json);
            } else {
                setSectionsError(json.error || 'Failed to load sections');
            }
        } catch (error) {
            setSectionsError('An error occurred while fetching sections: ' + error.message);
        }
    };

    // Fetch students for the selected section
    const fetchStudents = async (sectionId) => {
          setStudents([]); // Clear students when selecting a new section
          setStudentsError('')
          setActiveSectionId(sectionId);
        try {
            const response = await fetch(`http://localhost:4000/member/students/${sectionId}`);
            const json = await response.json();
            if (response.ok) {
                setStudents(json);
            } else {
                setStudentsError(json.error || 'Failed to load students');
            }
        } catch (error) {
            setStudentsError('An error occurred while fetching students: ' + error.message);
        }
    };

    return (
        <div className={style.grade}>
            {gradeError && <p className={style.error}>{gradeError}</p>}

            {grades.length > 0 && (
                <div className={style.gradeContainer}>
                    <h2>Select a Grade</h2> 
                    <div className={style.gradeBox}>
                    {grades.map(grade => (
                        <button
                            className={`button ${activeGradeId === grade._id ? style.activeButton : ''}`}
                            key={grade._id}
                            onClick={() => fetchSections(grade._id)}
                        >
                            Grade {grade.grade}
                        </button>
                    ))}
                    </div>
                </div>
            )}

            {sectionsError && <p className={style.error}>{sectionsError}</p>}

            {sections.length > 0 && (
                <div className={style.sectionContainer}>
                    <h2>Select a Section</h2>
                    <div className={style.sectionBox}>
                    {sections.map(section => (
                        <button
                            className={`button ${activeSectionId === section._id ? style.activeButton : ''}`}
                            key={section._id}
                            onClick={() => fetchStudents(section._id)}
                        >
                            Section {section.section}
                        </button>
                    ))}
                    </div>
                </div>
            )}

            {studentsError && <p className={style.error}>{studentsError}</p>}

            {students.length > 0 && (
                <div className={style.studentContainer}>
                    <h3>Students in Section</h3>
                    
                    <ul className={style.studentBox}>
                        {students.map(student => (
                            <li key={student._id}>
                                {student.first} {student.middle} {student.last} 
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Grade;
