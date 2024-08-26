import React, { useState, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';

function CreateSectionSubject({ teacherId }) {
    const [grades, setGrades] = useState([]);
    const [sections, setSections] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);
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

    useEffect(() => {
        if (selectedSection) {
            const fetchSubjects = async () => {
                setLoading(true);
                try {
                    const response = await fetch(`http://localhost:4000/class/subjects/${selectedSection._id}`);
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
        }
    }, [selectedSection]);

    const handleGradeChange = (e) => {
        setSelectedGrade(e.value);
        setSelectedSection(null);
        setSelectedSubjects([]);
    };

    const handleSectionChange = (e) => {
        setSelectedSection(e.value);
    };

    const handleSubjectChange = (e) => {
        setSelectedSubjects(e.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:4000/medium/assign`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ teacherId, sectionId: selectedSection, subjects: selectedSubjects })
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
                    <Dropdown value={selectedGrade} options={grades} onChange={handleGradeChange} optionLabel="grade" placeholder="Select a Grade" className="w-full md:w-20rem" />
                </div>

                {selectedGrade && (
                    <div>
                        <label>Select Section:</label>
                        <Dropdown value={selectedSection} options={sections} onChange={handleSectionChange} optionLabel="section" placeholder="Select a Section" className="w-full md:w-20rem" />
                    </div>
                )}

                {selectedSection && (
                    <div>
                        <label>Select Subjects:</label>
                        <MultiSelect value={selectedSubjects} options={subjects} onChange={handleSubjectChange} optionLabel="name" placeholder="Select Subjects" className="w-full md:w-20rem" display="chip" />
                    </div>
                )}

                <Button type="submit" label="Add Sections and Subjects" className="mt-4" />
            </form>
        </div>
    );
}

export default CreateSectionSubject;
