import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import LoadingIndicator from '../../../common/LoadingIndicator';
import ErrorMessage from '../../../common/ErrorMessage';

function CreateScore({ subjectId }) {
    const [error, setError] = useState('');
    const [subjectInfo, setSubjectInfo] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const { teacherId } = location.state || {};

    useEffect(() => {
        let isMounted = true;
        const fetchSubject = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:4000/class/subject/${subjectId}`);
                const json = await response.json();
                if (response.ok && isMounted) {
                    setSubjectInfo(json.subject);
                    setStudents(json.students);
                } else if (isMounted) {
                    setError(json.error || 'Failed to fetch subject information');
                }
            } catch (error) {
                if (isMounted) {
                    setError(error.message || 'An unexpected error occurred');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };
        fetchSubject();
        return () => {
            isMounted = false;
        };
    }, [subjectId]);

    // Loading State
    if(loading){
      return <LoadingIndicator/>
    }

    // Error State
    if (error) {
      return <ErrorMessage error={error} />;
  }

    // Function to display order number based on the index
    const orderNumberTemplate = (rowData, { rowIndex }) => {
        return <span>{rowIndex + 1}</span>; // Displaying order number starting from 1
    };

    const fullNameTemplate = (rowData) => {
      return `${rowData.first} ${rowData.middle} ${rowData.last}`;
  };
    // Render subject and students data

    return (
        <div className="p-4">
            {subjectInfo && (
                <Card title={`Mark list of Grade ${subjectInfo.sectionId.gradeId.grade}${subjectInfo.sectionId.section} ${subjectInfo.name}`}>
                    <DataTable value={students} responsiveLayout="scroll" key={subjectInfo._id}>
                        <Column style={{width:"2rem"}} field="order" header="No." body={orderNumberTemplate}></Column>
                        <Column field="fullName" header="Full Name" body={fullNameTemplate}></Column>
                        <Column style={{width:"2rem"}} field="age" header="Age"></Column>
                        <Column style={{width:"3rem"}} field="gender" header="Gender"></Column>
                    </DataTable>
                </Card>
            )}
        </div>
    );
}

export default CreateScore;
