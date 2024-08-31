import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { DataTable} from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Message } from 'primereact/message';
import { Link } from 'react-router-dom';
import Delete from '../Delete/Delete';
import style from '../css/pages.module.css';

function Grade() {
    const [grades, setGrades] = useState([]);
    const [gradeError, setGradeError] = useState('');
    const [sections, setSections] = useState([]);
    const [sectionsError, setSectionsError] = useState('');
    const [students, setStudents] = useState([]);
    const [studentsError, setStudentsError] = useState('');
    const [activeGradeId, setActiveGradeId] = useState('');
    const [activeSectionId, setActiveSectionId] = useState('');
    const [deleteCard, setDeleteCard] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [selectedStudentId, setSelectedStudentId] = useState('');

    // Fetch grades on component mount
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
        setSectionsError('');
        setStudentsError('');

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
        setStudents([]);
        setStudentsError('');
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

    // Refetch students when delete is successful
    useEffect(() => {
        if (activeSectionId) {
            fetchStudents(activeSectionId);
        }
    }, [refreshTrigger]);

    const handleDeleteCard = (studentId) => {
        setSelectedStudentId(studentId);
        setDeleteCard(true);
    };

    const handleDeleteSuccess = () => {
        setDeleteCard(false);
        setRefreshTrigger((prev) => !prev); // Toggle refresh trigger
    };

    return (
        <div className={style.grade}>
            {gradeError && <Message severity="error" text={gradeError} />}
            
            {grades.length > 0 && (
                <div className={style.gradeContainer}>
                    <h2>Select a Grade</h2>
                    <div className={style.gradeBox}>
                        {grades.map((grade) => (
                            <Button
                                className={`button ${activeGradeId === grade._id ? 'activeButton' : ''}`}
                                key={grade._id}
                                onClick={() => fetchSections(grade._id)}
                            >
                                Grade {grade.grade}
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            {sectionsError && <Message severity="error" text={sectionsError} />}

            {sections.length > 0 && (
                <div className={style.sectionContainer}>
                    <h2>Select a Section</h2>
                    <div className={style.sectionBox}>
                        {sections.map((section) => (
                            <Button
                                className={`button ${activeSectionId === section._id ? 'activeButton' : ''}`}
                                key={section._id}
                                onClick={() => fetchStudents(section._id)}
                            >
                                Section {section.section}
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            {studentsError && <Message severity="error" text={studentsError} />}

            {students.length > 0 && (
                <div className={style.studentContainer}>
                    <h3>Students in Section</h3>
                    <DataTable value={students} paginator rows={10} className="p-datatable-gridlines">
                        <Column field="index" header="No" body={(data, { rowIndex }) => rowIndex + 1} />
                        <Column field="name" header="Name" body={(data) => `${data.first} ${data.middle} ${data.last}`} />
                        <Column header="Action" body={(data) => (
                            <>
                                <Button 
                                    className="p-button p-button-danger p-mr-2"
                                    icon="pi pi-trash" 
                                    onClick={() => handleDeleteCard(data._id)}
                                />
                                <Link to={`/main?type=student&action=${data._id}`}>
                                    <Button className="p-button p-button-secondary p-mr-2">Edit</Button>
                                </Link>
                                <Link to={`/main?type=student&studentId=${data._id}`}>
                                    <Button className="p-button p-button-info">View</Button>
                                </Link>
                            </>
                        )} />
                    </DataTable>
                </div>
            )}
               {deleteCard && <Delete 
                    setDeleteCard={setDeleteCard}
                    first={students.find(student => student._id === selectedStudentId)?.first}
                    middle={students.find(student => student._id === selectedStudentId)?.middle}
                    role={"Student"}
                    id={selectedStudentId}
                    onDeleteSuccess={handleDeleteSuccess}
                />}
        </div>
    );
}

export default Grade;