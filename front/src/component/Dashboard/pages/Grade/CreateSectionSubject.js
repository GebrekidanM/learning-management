import React, { useState, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import LoadingIndicator from '../../../common/LoadingIndicator';
import ErrorMessage from '../../../common/ErrorMessage';

function CreateSectionSubject({ teacherId }) {
    const [grades, setGrades] = useState([]);
    const [sections, setSections] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [teacher,setTeacher] = useState('')
    const [selectedGrade, setSelectedGrade] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    //fetching grades
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

    //looking for sections by using selectedGrade
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

    //looking for subjects by using 'selectedSection'
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

    useEffect(()=>{
        const fetchTeacher = async ()=>{
            const response = await fetch(`http://localhost:4000/member/teacher/${teacherId}`)
            const json = await response.json()
            if(response.ok){
                setTeacher(json)
            }
        }
        fetchTeacher()
    },[teacherId])

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
                navigate(`/main?type=teacher&teacherId=${teacherId}`)
            } else {
                setError(data.error || 'Error adding sections and subjects');
            }
        } catch (err) {
            setError(err.message);
        }
    };
    if(loading){
        return <LoadingIndicator/>
      }
    

    return (
        <div>
            <h2>Add Sections and Subjects to Teacher</h2>
            <form onSubmit={handleSubmit}>
                {error && <ErrorMessage error={error} />}
                {teacher && <div className='mb-3'><b>Teacher Name:</b> <u>{teacher.first} {teacher.middle} {teacher.last}</u></div>}
                <div className='card flex flex-column gap-3 mb-3'>
                    <label>Select Grade:</label>
                    <Dropdown value={selectedGrade} options={grades} onChange={handleGradeChange} optionLabel="grade" placeholder="Select a Grade" className="w-full md:w-20rem" />
                </div>

            {/** select section from sections list */}
                {selectedGrade && (
                    <div className='card flex flex-column  mb-3'>
                        <label>Select Section:</label>
                        <Dropdown value={selectedSection} options={sections} onChange={handleSectionChange} optionLabel="section" placeholder="Select a Section" className="w-full md:w-20rem mt-4" />
                    </div>
                )}
        
            {/** select subjects from subjects list */}
                {selectedSection && (
                    <div className='card flex flex-column gap-1 mb-3'>
                        <label>Select Subjects:</label>
                        <MultiSelect value={selectedSubjects} options={subjects} onChange={handleSubjectChange} optionLabel="name" placeholder="Select Subjects" className="w-full md:w-20rem mt-4" display="chip" />
                    </div>
                )}

                <Button type="submit" label="Add Sections and Subjects" className={`button`} />
            </form>
        </div>
    );
}

export default CreateSectionSubject;
