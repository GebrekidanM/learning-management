import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { DataTable} from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Message } from 'primereact/message';
import { Link } from 'react-router-dom';
import Delete from '../Delete/Delete';
import style from '../css/pages.module.css';
import GradeDropdown from './ForGrade/GradeDropDown';
import SectionDropdown from './ForGrade/SectionDropDown';
import URL from '../../../UI/URL';

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
                const response = await fetch(`${URL()}/class/grades`);
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
            const response = await fetch(`${URL()}/class/sections/${gradeId}`);
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
            const response = await fetch(`${URL()}/member/students/${sectionId}`);
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
                <div className='mb-3'>
                    <div className={style.gradeBox}>
                        <GradeDropdown grades={grades} activeGradeId={activeGradeId}   fetchSections={fetchSections}/>
                        {activeGradeId && <SectionDropdown sections={sections}  fetchStudents={fetchStudents}/>}
                    </div>
                </div>                
            )}

            {sectionsError && <Message severity="error" text={sectionsError} />}
            
            {studentsError && <Message severity="error" text={studentsError} />}

            {students.length > 0 && (
                <div className={style.studentContainer}>
                    <DataTable value={students} paginator rows={5} className="p-datatable-gridlines">
                        <Column style={{width:'2rem'}} field="index" header="No" body={(data, { rowIndex }) => rowIndex + 1} />
                        <Column field="name" header="Name" body={(data) => `${data.first} ${data.middle} ${data.last}`} />
                        <Column className='flex gap-3' header="Action" body={(data) => (
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
