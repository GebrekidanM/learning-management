import React, { useEffect, useState } from 'react';
import style from "../css/GradeSectionSelector.module.css";
import { useNavigate, useSearchParams } from 'react-router-dom';
import CreateStudent from '../Student/CreateStudent';
import LoadingIndicator from '../../../common/LoadingIndicator';

function GradeSectionSelector() {
    const [grades, setGrades] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState(null);
    const [sections, setSections] = useState([]);
    const [loadingGrades, setLoadingGrades] = useState(false);
    const [loadingSections, setLoadingSections] = useState(false);
    const [error, setError] = useState('');
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type');
    const sectionId = searchParams.get('sectionId');

    const navigate = useNavigate();

    const fetchData = async (url, setLoadingState, setDataState) => {
        setLoadingState(true);
        try {
            const response = await fetch(url);
            const json = await response.json();
            if (response.ok) {
                setDataState(json);
                setError('');
            } else {
                setError(json.error || 'Error fetching data');
            }
        } catch (err) {
            setError('Error fetching data');
        } finally {
            setLoadingState(false);
        }
    };

    useEffect(() => {
        fetchData('http://localhost:4000/class/grades', setLoadingGrades, setGrades);
    }, []);

    useEffect(() => {
        if (selectedGrade) {
            fetchData(`http://localhost:4000/class/grades/${selectedGrade._id}/sections`, setLoadingSections, setSections);
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
                        {loadingGrades ? <LoadingIndicator/> : (
                            <div className={style.gradeListBox}>
                                {grades.map(grade => (
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

                    {selectedGrade && !loadingGrades && (
                        <div className={style.gradeSelector} style={{ marginTop: "1rem" }}>
                            <h4>Sections for Grade {selectedGrade.grade}</h4>
                            {loadingSections ? (
                                <LoadingIndicator/>
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
                    <CreateStudent sectionId={sectionId} />
                </div>
            )}
        </div>
    );
}

export default GradeSectionSelector;
