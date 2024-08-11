import React, { useEffect, useState } from 'react';

function GradeSectionSelector() {
    const [grades, setGrades] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState(null);
    const [sections, setSections] = useState([]);
    const [error,setError] = useState('')
    // Fetch all grades when the component mounts
    useEffect(() => {
        const fetchGrades = async () => {
            const response = await fetch('http://localhost:4000/class/grades');
            const data = await response.json();
            if (response.ok) {
                setGrades(data.getGrade);
            } else {
                setError('Error fetching grades:', data.error);
            }
        };

        fetchGrades();
    }, []);
    console.log(grades)

    // Fetch sections when a grade is selected
    useEffect(() => {
        if (selectedGrade) {
            const fetchSections = async () => {
                const response = await fetch(`http://localhost:4000/class/grades/${selectedGrade._id}/sections`);
                const data = await response.json();
                if (response.ok) {
                    setSections(data);
                } else {
                    setError('Error fetching sections:', data.error);
                }
            };

            fetchSections();
        }
    }, [selectedGrade]);

    return (
        <div>
            <h2>Select a Grade</h2>
            {error && <p>{error}</p>}

            <ul>
                {grades && grades.map(grade => (
                    <li key={grade._id} onClick={() => setSelectedGrade(grade)}>
                        Grade {grade.grade}
                    </li>
                ))}
            </ul>

            {selectedGrade && (
                <div>
                    <h3>Sections for Grade {selectedGrade.grade}</h3>
                    <ul>
                        {sections.map(section => (
                            <li key={section._id}>
                                {section.section}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default GradeSectionSelector;
