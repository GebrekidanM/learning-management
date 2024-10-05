import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Dropdown } from 'primereact/dropdown';
import style from '../css/pages.module.css';
import CreateTeacher from './CreateTeacher';
import LoadingIndicator from '../../../common/LoadingIndicator';
import URL from '../../../UI/URL';
import FireTeacher from './FireTeacher';

function Teacher({yearName, yearId}) {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const teachType = searchParams.get('teachType');
  const [deleteCard, setDeleteCard] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Generate new search params for the URL
  function generateNewSearchParams(key, value) {
    const type = new URLSearchParams(searchParams);
    type.set(key, value);
    return `?${type.toString()}`;
  }

  
  // Fetch teachers from the server
  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${URL()}/teachers`);
      const json = await response.json();
      if (response.ok) {
        setTeachers(json);
        setFilteredTeachers(json);
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

  // Filter teachers based on the selected filter and search query
  useEffect(() => {
    let updatedTeachers = teachers;

    if (filter !== 'all') {
      const isActive = filter === 'unfired';
      updatedTeachers = updatedTeachers.filter(teacher => teacher.isActive === isActive);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      updatedTeachers = updatedTeachers.filter(teacher => 
        `${teacher.first} ${teacher.middle}`.toLowerCase().includes(query)
      );
    }

    setFilteredTeachers(updatedTeachers);
  }, [filter, searchQuery, teachers]);

  const handleTeacherCard = (teacherId) => {
    setSelectedTeacherId(teacherId);
    setDeleteCard(true);
  };

  const handleDeleteSuccess = () => {
    setDeleteCard(false);
    setRefreshTrigger((prev) => !prev); // Toggle refresh trigger to refetch teachers
  };

  const filterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'unfired' },
    { label: 'Fired', value: 'fired' }
  ];

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <div className={style.pageContainer}>
      <div className='flex justify-between my-2'>
          <input
            type="text"
            className='w-96 rounded-sm'
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        <Dropdown
          value={filter}
          options={filterOptions}
          onChange={(e) => setFilter(e.value)}
          placeholder="Select Status"
          className="min-w-32 text-center flex items-center"
        />
        <Link to={generateNewSearchParams('teachType', 'createTeacher')} className={'button p-2'}>
          Add new
        </Link>
      </div>
      <div>
        {teachType === 'createTeacher' ? (
          <CreateTeacher yearId={yearId} yearName={yearName} />
        ) : (
          <div>
            <table className='w-full'>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Name</th>
                  <th>Phone No.</th>
                  <th colSpan="3">Action</th>
                </tr>
              </thead>
              <tbody>
                {error && <p className='error'>{error}</p>}
                {filteredTeachers.length > 0 &&
                  filteredTeachers.map((teacher, index) => (
                    <tr key={teacher._id}>
                      <td>{index + 1}</td>
                      <td style={{ color: !teacher.isActive ? 'red' : 'black' }}>
                        {teacher.first} {teacher.middle}
                      </td>
                      <td>{teacher.phoneNo}</td>
                      
                      {
                        teacher.isActive 
                        ? 
                        <td className='delete' onClick={() => handleTeacherCard(teacher._id)}> Fire</td>
                        :
                        <td>Fired</td>
                      }
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
          <FireTeacher
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
