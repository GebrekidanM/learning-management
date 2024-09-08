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
  const [loadingSub, setLoadingSub] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingSec, setLoadingSec] = useState(false);
  const [cardForSubject, setCardForSubject] =useState(false);
  const [sectionId,setSectionId] = useState({})

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
  }, [semesterId]);

  // Fetch sections based on the selected grade
  useEffect(() => {
    const fetchSection = async () => {
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
      fetchSection();
    }
  }, [selectedGrade]);

  // Fetch subjects based on the selected section
  useEffect(() => {
    const fetchSubject = async () => {
      try {
        setLoadingSub(true);
        setErrorSub('');
        const response = await fetch(`${URL()}/subject/subjects/${selectedSection._id}`);
        const json = await response.json();
        if (response.ok) {
          setSubjects(json);
        } else {
          setErrorSub(json.error);
        }
      } catch (error) {
        setErrorSub(`An error occurred: ${error.message}`);
      } finally {
        setLoadingSub(false);
      }
    };

    if (selectedSection) {
      fetchSubject();
    }
  }, [selectedSection]);

  const gradeOptions = grades.map((grade) => ({
    label: `Grade ${grade.grade}`,
    value: grade.grade
  }));

  const sectionOptions = sections.map((section) => ({
    label: `Section ${section.section}`,
    value: section.section
  }));

  const handleGrade = (e) => {
    const selected = grades.find((grade) => grade.grade === e.value);
    setSelectedGrade(selected);
    setSelectedSection('');
    setSubjects([]);
  };

  const handleSection = (e) => {
    const selected = sections.find((section) => section.section === e.value);
    setSelectedSection(selected);
  };

  const handleSubjectCreating = (sectionId) => {
    setSectionId(sectionId)
    setCardForSubject(prev=>!prev)
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <div className={`w-full mt-5 flex flex-column`}>
      <div className={`w-full mt-5 flex flex-column gap-3`}>
        <div className="w-6">
          {error && <ErrorMessage error={error} />}
          <Dropdown
            value={selectedGrade?.grade}
            onChange={handleGrade}
            options={gradeOptions}
            optionLabel="label"
            placeholder="Select grade"
            className="w-6 bg-white text-cyan-900 border-cyan-900 border-1"
          />
        </div>
        <div className="w-6">
          {loadingSec && <LoadingIndicator />}
          {errorSec && <ErrorMessage error={errorSec} />}
          {selectedGrade && (
            <Dropdown
              value={selectedSection?.section}
              onChange={handleSection}
              options={sectionOptions}
              optionLabel="label"
              placeholder="Select section"
              className="w-6 bg-white text-cyan-900 border-cyan-900 border-1 text-left"
            />
          )}
          <div className="w-6 flex flex-column gap-3 align-items-start text-center">
          {selectedSection && subjects.length > 0 && (<>
              <h3 className="text-center">Subjects in Grade {selectedGrade.grade} {selectedSection.section}</h3>
              {errorSub && <ErrorMessage error={errorSub} />}
              {subjects.map((subject) => (
                <div key={subject._id} className="button w-12 bg-white text-cyan-900 border-cyan-900 border-1">
                  {subject.name}
                </div>
              ))}
              <div className="button w-12 bg-white text-cyan-900 border-cyan-900 border-1" onClick={()=>handleSubjectCreating(selectedSection._id)}>
                Add subject
              </div>
            </>)}
          </div>
          {loadingSub && <LoadingIndicator/>}
        </div>
      </div>
      <div>
         {cardForSubject && <CreateSubject sectionId={sectionId}/>}
      </div>
      
    </div>
  );
}

export default Subject;
