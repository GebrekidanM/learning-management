import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import style from './css/pages.module.css';
import CreateTeacher from './create/CreateTeacher';
import Delete from './component/delete/Delete';

function Teacher() {
  const [yearId, setYearId] = useState('');
  const [yearError, setYearError] = useState('');
  const [teachers, setTeachers] = useState([]); // Initialize as an array
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const teachType = searchParams.get('teachType');
  const [deleteCard, setDeleteCard] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(false); // Add a state for refresh trigger

  // Generate new search params for the URL
  function generateNewSearchParams(key, value) {
    const type = new URLSearchParams(searchParams);
    type.set(key, value);
    return `?${type.toString()}`;
  }

  // Check for the current academic year
  useEffect(() => {
    const checkYear = async () => {
      try {
        const response = await fetch('http://localhost:4000/class/check-academic-year');
        const json = await response.json();
        if (response.ok) {
          setYearId(json);
        } else {
          setYearError(json.error);
        }
      } catch (error) {
        setYearError(error.message);
      }
    };
    checkYear();
  }, []);

  // Fetch teachers from the server
  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/member/teachers');
      const json = await response.json();
      if (response.ok) {
        setTeachers(json);
      } else {
        setError(json.error);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers(); // Fetch teachers when the component mounts
  }, []);

  useEffect(() => {
    fetchTeachers(); // Refetch teachers when the refreshTrigger changes
  }, [refreshTrigger]);

  const handleTeacherCard = (teacherId) => {
    setSelectedTeacherId(teacherId);
    setDeleteCard(true);
  };

  const handleDeleteSuccess = () => {
    setDeleteCard(false);
    setRefreshTrigger((prev) => !prev); // Toggle refresh trigger to refetch teachers
  };

  return (
    <div className={style.pageContainer}>
      <div className={style.pagehead}>
        <div className={style.searchContainer}>
          <input type="text" className={style.searchInput} placeholder="Search..." />
          <button className={style.searchButton}>Search</button>
        </div>
        <Link to={generateNewSearchParams('teachType', 'createTeacher')} className={style.button}>
          Add new
        </Link>
      </div>
      <div>
        {teachType === 'createTeacher' ? (
          <CreateTeacher yearId={yearId} yearError={yearError} />
        ) : (
          <div>
            {loading && <p>Loading...</p>}
            {error && <p className='error'>{error}</p>}

            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Name</th>
                  <th>Phone No.</th>
                  <th colSpan="3">Action</th>
                </tr>
              </thead>
              <tbody>
                {teachers.length > 0 &&
                  teachers.map((teacher, index) => (
                    <tr key={teacher._id}>
                      <td>{index + 1}</td>
                      <td>{teacher.first} {teacher.middle}</td>
                      <td>{teacher.phoneNo}</td>
                      <td className={'delete'} onClick={() => handleTeacherCard(teacher._id)}>Delete</td>
                      <td className={'edit'}>
                        <Link to={`/main?type=teacher&action=${teacher._id}`}>Edit</Link>
                      </td>
                      <td className={'view'}>
                        <Link to={`/main?type=teacher&teacherId=${teacher._id}`}>View</Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
        {deleteCard && (
          <Delete
            onDeleteSuccess={handleDeleteSuccess}
            id={selectedTeacherId}
            first={teachers.find(teacher => teacher._id === selectedTeacherId)?.first}
            middle={teachers.find(teacher => teacher._id === selectedTeacherId)?.middle}
            role={'Teacher'}
            setDeleteCard={setDeleteCard}
          />
        )}
      </div>
    </div>
  );
}

export default Teacher;
