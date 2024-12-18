import React, { useEffect, useState } from 'react';
import style from "../css/GradeSectionSelector.module.css";
import { useNavigate, useSearchParams } from 'react-router-dom';
import CreateStudent from '../Student/CreateStudent';
import LoadingIndicator from '../../../common/LoadingIndicator';
import URL from '../../../UI/URL';

function GradeSectionSelector({ semesterId }) {
    const [grades, setGrades] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState(null);
    const [sections, setSections] = useState([]);
    const [loadingGrades, setLoadingGrades] = useState(false);
    const [loadingSections, setLoadingSections] = useState(false);
    const [error, setError] = useState('');
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type');
    const sectionId = searchParams.get('sectionId');
    const [yearName, setYearName] = useState(null);

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
        if (semesterId) {
            fetchData(`${URL()}/class/grades/${semesterId}`, setLoadingGrades, setGrades);
        }
    }, [semesterId]);

    useEffect(() => {
        if (selectedGrade) {
            setYearName(selectedGrade?.yearId.yearName);
            fetchData(`${URL()}/class/sections/${selectedGrade._id}`, setLoadingSections, setSections);
        }
    }, [selectedGrade]);

    const handleSectionClick = (sectionId,yearName) => {
        const year = yearName
        navigate(`/main?type=student&sectionId=${sectionId}`,{state:{yearName:year}});
    };

    return (
        <div className={style.GradeSectionBox}>
            {!sectionId && (
                <>
                    <div className={style.gradeSelector}>
                        <h2 className='font-bold mb-2'>Select a Grade</h2>
                        {error && <p className='error'>{error}</p>}
                        {loadingGrades ? <LoadingIndicator /> : (
                            <div className={style.gradeListBox}>
                                {grades.map(grade => (
                                    <li 
                                        className={`${style.gradeList} bg-white text-cyan-900 border-cyan-900 border-1 p-2`} 
                                        key={grade._id} 
                                        onClick={() => setSelectedGrade(grade)}
                                    >
                                        Grade {grade.grade}
                                    </li>
                                ))}
                            </div>
                        )}
                    </div>
                    {selectedGrade && !loadingGrades && (
                        <div className={style.gradeSelector} style={{ marginTop: "1rem" }}>
                            <h4 className='font-bold mb-2'>Sections for Grade {selectedGrade.grade}</h4>
                            {loadingSections ? (
                                <LoadingIndicator />
                            ) : (
                                <div className={style.gradeListBox}>
                                    {sections.length > 0 ? (
                                        sections.map(section => (
                                            <li 
                                                className={`bg-white text-cyan-900 border-cyan-900 border-1 p-2 ${style.gradeList}`} 
                                                key={section._id}
                                                onClick={() => handleSectionClick(section._id,yearName)}
                                            >
                                                {section.section}
                                            </li>
                                        ))
                                    ) : (
                                        <p>No sections available.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}

            {type === 'student'  && sectionId && (
                <div>
                    <CreateStudent sectionId={sectionId} />
                </div>
            )}
        </div>
    );
}

export default GradeSectionSelector;
