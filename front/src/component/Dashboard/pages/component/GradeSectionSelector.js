import React, { useEffect, useState } from 'react';
import style from "../css/GradeSectionSelector.module.css";
import { useNavigate, useSearchParams } from 'react-router-dom';
import CreateStudent from '../create/CreateStudent';

function GradeSectionSelector() {
    const [grades, setGrades] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState(null);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type');
    const sectionId = searchParams.get('sectionId');

    const navigate = useNavigate();

    // Fetch all grades when the component mounts
    useEffect(() => {
        const fetchGrades = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:4000/class/grades');
                const json = await response.json();
                if (response.ok) {
                    setGrades(json);
                } else {
                    setError(json.error || 'Error fetching grades');
                }
            } catch (err) {
                setError('Error fetching grades');
            } finally {
                setLoading(false);
            }
        };
        fetchGrades();
    }, []);

    // Fetch sections when a grade is selected
    useEffect(() => {
        if (selectedGrade) {
            const fetchSections = async () => {
                setLoading(true);
                try {
                    const response = await fetch(`http://localhost:4000/class/grades/${selectedGrade._id}/sections`);
                    const data = await response.json();
                    if (response.ok) {
                        setSections(data);
                    } else {
                        setError(data.error || 'Error fetching sections');
                    }
                } catch (err) {
                    setError('Error fetching sections');
                } finally {
                    setLoading(false);
                }
            };
            fetchSections();
        }
    }, [selectedGrade]);

    const handleSectionClick = (sectionId) => {
        navigate(`/main?type=student&sectionId=${sectionId}`);
    };

    return (
        <div className={style.GradeSectionBox}>
            {!sectionId && (
                <>
                    <div className={style.gradeSelector}>
                        <h2>Select a Grade</h2>
                        {error && <p className={'error'}>{error}</p>}
                        {loading ? (
                            <p>Loading grades...</p>
                        ) : (
                            <div className={style.gradeListBox}>
                                {grades?.map(grade => (
                                    <li 
                                        className={style.gradeList} 
                                        key={grade._id} 
                                        onClick={() => setSelectedGrade(grade)}>
                                        Grade {grade.grade}
                                    </li>
                                ))}
                            </div>
                        )}
                    </div>

                    {selectedGrade && !loading && (
                        <div className={style.gradeSelector} style={{ marginTop: "1rem" }}>
                            <h4>Sections for Grade {selectedGrade.grade}</h4>
                            {loading ? (
                                <p>Loading sections...</p>
                            ) : (
                                <div className={style.gradeListBox}>
                                    {sections.map(section => (
                                        <li 
                                            className={style.gradeList} 
                                            key={section._id}
                                            onClick={() => handleSectionClick(section._id)}>
                                            {section.section}
                                        </li>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}

            {type === 'student' && sectionId && (
                <div>
                    hello
                <CreateStudent sectionId={sectionId} />
                </div>
            )}
        </div>
    );
}

export default GradeSectionSelector;
