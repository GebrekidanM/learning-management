import React, { useState, useEffect } from 'react';

function CreateSectionSubject({ teacherId }) {
    const [grades, setGrades] = useState([]);
    const [sections, setSections] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState(null);
    const [selectedSections, setSelectedSections] = useState([]);
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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

    // Fetch subjects
    useEffect(() => {
        const fetchSubjects = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:4000/class/subjects');
                const data = await response.json();
                if (response.ok) {
                    setSubjects(data);
                } else {
                    setError(data.error || 'Error fetching subjects');
                }
            } catch (err) {
                setError('Error fetching subjects');
            } finally {
                setLoading(false);
            }
        };
        fetchSubjects();
    }, []);

    const handleGradeChange = (e) => {
        const grade = grades.find(g => g._id === e.target.value);
        setSelectedGrade(grade);
        setSelectedSections([]);
        setSelectedSubjects([]);
    };

    const handleSectionChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
        setSelectedSections(selectedOptions);
    };

    const handleSubjectChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
        setSelectedSubjects(selectedOptions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:4000/medium/add-sections-subjects/${teacherId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sections: selectedSections.map(sectionId => ({
                        sectionId,
                        subjectIds: selectedSubjects,
                    })),
                }),
            });

            const data = await response.json();
            if (response.ok) {
                alert('Sections and subjects added successfully!');
            } else {
                setError(data.error || 'Error adding sections and subjects');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h2>Add Sections and Subjects to Teacher</h2>
            {error && <p className="error">{error}</p>}
            {loading && <p>Loading...</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Select Grade:</label>
                    <select onChange={handleGradeChange}>
                        <option value="">Select Grade</option>
                        {grades.map(grade => (
                            <option key={grade._id} value={grade._id}>
                                Grade {grade.grade}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedGrade && (
                    <div>
                        <label>Select Sections:</label>
                        <select onChange={handleSectionChange}>
                            {sections.map(section => (
                                <option key={section._id} value={section._id}>
                                    {section.gradeId.grade} {section.section}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div>
                    <label>Select Subjects:</label>
                    <select multiple onChange={handleSubjectChange}>
                        {subjects.map(subject => (
                            <option key={subject._id} value={subject._id}>
                                {subject.name}
                            </option>
                        ))}
                    </select>
                    
                </div>

                <button type="submit">Add Sections and Subjects</button>
            </form>
        </div>
    );
}

export default CreateSectionSubject;
