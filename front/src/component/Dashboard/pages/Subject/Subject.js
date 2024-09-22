import React, { useEffect, useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import LoadingIndicator from '../../../common/LoadingIndicator';
import ErrorMessage from '../../../common/ErrorMessage';
import URL from '../../../UI/URL';
import CreateSubject from './CreateSubject';

function Subject({ semesterId }) {
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState('');
  const [errorSec, setErrorSec] = useState('');
  const [errorSub, setErrorSub] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingSec, setLoadingSec] = useState(false);
  const [loadingSub, setLoadingSub] = useState(false);
  const [cardForSubject, setCardForSubject] = useState(false);
  const [refresh, setRefresh] = useState(false);


  // Fetch grades based on the semester ID
  useEffect(() => {
    const fetchGrades = async () => {
      try {
        setLoading(true);
        setError('');
        setSections([]);
        setSubjects([]);
        const response = await fetch(`${URL()}/class/grades/${semesterId}`);
        const json = await response.json();
        if (response.ok) {
          setGrades(json);
        } else {
          setError(json.error || 'Failed to fetch grades.');
        }
      } catch (error) {
        setError(`An error occurred: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (semesterId) {
      fetchGrades();
    }
  }, [semesterId, refresh]);

  // Fetch sections based on the selected grade
  useEffect(() => {
    const fetchSections = async () => {
      try {
        setLoadingSec(true);
        setErrorSec('');
        setSections([]);
        setSubjects([]);
        const response = await fetch(`${URL()}/class/sections/${selectedGrade._id}`);
        const json = await response.json();
        if (response.ok) {
          setSections(json);
        } else {
          setErrorSec(json.error || 'Failed to fetch sections.');
        }
      } catch (error) {
        setErrorSec(`An error occurred: ${error.message}`);
      } finally {
        setLoadingSec(false);
      }
    };

    if (selectedGrade) {
      fetchSections();
    }
  }, [selectedGrade]);

  // Fetch subjects based on the selected section
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoadingSub(true);
        setErrorSub('');
        const response = await fetch(`${URL()}/subject/subjects/${selectedSection._id}`);
        const json = await response.json();
        if (response.ok) {
          setSubjects(json);
        } else {
          setErrorSub(json.error || 'Failed to fetch subjects.');
        }
      } catch (error) {
        setErrorSub(`An error occurred: ${error.message}`);
      } finally {
        setLoadingSub(false);
      }
    };

    if (selectedSection) {
      fetchSubjects();
    }
  }, [selectedSection, refresh]);

  const gradeOptions = grades.map((grade) => ({
    label: `Grade ${grade.grade}`,
    value: grade.grade
  }));

  const sectionOptions = sections.map((section) => ({
    label: `Section ${section.section}`,
    value: section.section
  }));

  const handleGradeChange = (e) => {
    const selected = grades.find((grade) => grade.grade === e.value);
    setSelectedGrade(selected);
    setSelectedSection('');
    setSubjects([]);
    setCardForSubject(false);
  };

  const handleSectionChange = (e) => {
    const selected = sections.find((section) => section.section === e.value);
    setSelectedSection(selected);
  };

  const handleSubjectCreation = () => {
    setCardForSubject(true);
  };

  // Handle editing of a subject
  const handleEditSubject = (subject) => {
    const newName = prompt('Enter new subject name:', subject.name);
    if (newName && newName !== subject.name) {
      updateSubject(subject._id, newName);
    }
  };

  // Handle subject update
  const updateSubject = async (subjectId, newName) => {
    try {
      setLoadingSub(true);
      const response = await fetch(`${URL()}/subject/update/${subjectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      });
      const json = await response.json();
      if (!response.ok) {
        setErrorSub(json.error || 'Failed to update subject.');
      } else {
        setRefresh(prev => !prev);
      }
    } catch (error) {
      setErrorSub(`An error occurred: ${error.message}`);
    } finally {
      setLoadingSub(false);
    }
  };

  // Handle deleting of a subject
  const handleDeleteSubject = async (subjectId) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        setLoadingSub(true);
        const response = await fetch(`${URL()}/subject/delete/${subjectId}`, {
          method: 'DELETE',
        });
        const json = await response.json();
        if (!response.ok) {
          setErrorSub(json.error || 'Failed to delete subject.');
        } else {
          setRefresh(prev => !prev);
        }
      } catch (error) {
        setErrorSub(`An error occurred: ${error.message}`);
      } finally {
        setLoadingSub(false);
      }
    }
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="w-full flex gap-3" style={{zIndex:'-10'}}>
      <div className="w-6 flex flex-column gap-3">
          <div className='w-3 z-1 flex flex-column gap-3 top-1 pt-4 fixed bg-gray-300'>
             <h3>The area to create subject</h3>
             <div>
              {error && <ErrorMessage error={error} />}
              <Dropdown
                value={selectedGrade?.grade}
                onChange={handleGradeChange}
                options={gradeOptions}
                optionLabel="label"
                placeholder="Select grade"
                className="w-10 bg-white text-cyan-900 border-cyan-900 border-1 z-0 p-2"
              />
              </div>
              {loadingSec ? (
                <LoadingIndicator />
              ) : errorSec ? (
                <ErrorMessage error={errorSec} />
              ) : (
                selectedGrade && (
                  <Dropdown
                    value={selectedSection?.section}
                    onChange={handleSectionChange}
                    options={sectionOptions}
                    optionLabel="label"
                    placeholder="Select section"
                    className="w-10 bg-white text-cyan-900 border-cyan-900 border-1 text-left z-0"
                  />
                )
              )}
          </div>
          <div className="mt-8 w-6 flex flex-column gap-3 align-items-start text-center">
            {selectedSection && (
              <>
                <h3 className="mt-8 text-center">
                  Subjects in Grade {selectedGrade.grade} {selectedSection.section}
                </h3>
                {errorSub && <ErrorMessage error={errorSub} />}
                {subjects.map((subject) => (
                  <div key={subject._id} className="deleteAndEdit w-12 bg-white text-cyan-900 border-cyan-900 border-1 my-2 px-2 py-1">
                    <div>{subject.name}</div>
                    <div className="flex z-0">
                      <button
                        className="p-button p-component p-button-text p-button-plain"
                        onClick={() => handleEditSubject(subject)}
                      >
                        <i className="pi pi-pencil text-cyan-900"></i>
                      </button>
                      <button
                        className="p-button p-component p-button-text p-button-plain"
                        onClick={() => handleDeleteSubject(subject._id)}
                      >
                        <i className="pi pi-trash text-red-500"></i>
                      </button>
                    </div>
                  </div>
                ))}
                <div
                  className="button w-12 bg-white text-cyan-900 border-cyan-900 border-1 my-2"
                  onClick={handleSubjectCreation}
                >
                  Add subject
                </div>
              </>
            )}
          </div>
          {loadingSub && <LoadingIndicator />}
      </div>
      {cardForSubject && selectedSection && (
        <CreateSubject sectionId={selectedSection._id} setRefresh={setRefresh} setCardForSubject={setCardForSubject} />
      )}
    </div>
  );
}

export default Subject;
