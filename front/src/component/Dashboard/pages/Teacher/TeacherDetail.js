import React, { useContext, useEffect, useState } from 'react';
import style from '../css/detail.module.css';
import SectionCard from '../Grade/SectionCard';
import css from '../css/SectionCard.module.css';
import LoadingIndicator from '../../../common/LoadingIndicator';
import URL from '../../../UI/URL';
import { Link } from 'react-router-dom';
import ErrorMessage from '../../../common/ErrorMessage';
import { AuthContext } from '../../../../context/AuthContext';
import UpdateTeacherSubject from './UpdateTeacherSubject';

function TeacherDetail({ teacherId, yearId }) {
  const [sectionInfos, setSectionInfos] = useState([]);
  const [errorInfo, setErrorInfo] = useState('');
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [teacher, setTeacher] = useState("");
  const [homeClass, setHomeClass] = useState("");
  const [showHomeClassForm, setShowHomeClassForm] = useState(false);
  const [selectedSection, setSelectedSection] = useState('');
  const { loggedUser } = useContext(AuthContext);
  const [toggle, setToggle] = useState(false);
  const [errorhome,setErrorhome] = useState('')

  useEffect(() => {
    const fetchTeacher = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${URL()}/teacher/${teacherId}`);
        const json = await response.json();
        if (response.ok) {
          setTeacher(json);
          setHomeClass(json.homeTeacher);
          setError('')
        } else {
          setError('Failed to fetch teacher details.');
        }
      } catch (error) {
        setError('An error occurred while fetching teacher details.');
      } finally {
        setLoading(false);
      }
    };
    fetchTeacher();
  }, [teacherId, toggle]);

  const handleAddHomeClass = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${URL()}/teacher/class/home/${teacherId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ homeClass: selectedSection }),
        credentials:'include'
      });
      const json = await response.json();
      if (response.ok) {
        setToggle((prev) => !prev);
        setErrorhome('')
        setShowHomeClassForm(false);

      } else {
        setErrorhome(json.error || 'Failed to update home class.');
      }
    } catch (error) {
      setErrorInfo('An error occurred while updating home class.');
    }
  };

  useEffect(() => {
    const fetchTeacherSections = async () => {
      setLoadingInfo(true);
      try {
        const response = await fetch(`${URL()}/medium/teacher/section/${teacherId}`);
        const json = await response.json();
        if (response.ok) {
          setSectionInfos(json);
        } else {
          setErrorInfo('Failed to fetch sections.');
        }
      } catch (error) {
        setErrorInfo('An error occurred while fetching section information.');
      } finally {
        setLoadingInfo(false);
      }
    };

    if (loggedUser?.role === "Admin" || loggedUser?.role === "Editor") {
      fetchTeacherSections();
    }
  }, [teacherId, loggedUser, toggle]);

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    (loggedUser?.role === "Admin" || loggedUser?.role === "Editor") && (
      <div className='flex flex-col items-start mt-2'>
        {error && <ErrorMessage error={error} />}
        {teacher && (
          <div className="flex justify-between mt-4 gap-4 items-start">
            <div className={` w-60 pb-3 bg-gray-400 shadow-md shadow-black`}>
              <img src={`${URL()}/uploads/${teacher.teacherPhoto}`} alt="teacher" />
              <div className="flex flex-col gap-2 pr-2 ml-3 mt-3 w-full">
                <h5 className="font-bold py-2 ">{teacher.first} {teacher.middle} {teacher.last}</h5>
                <p className="text-left">Gender: {teacher.gender}</p>
                <p className="text-left">Age: {teacher.age}</p>
                <p className="text-left">Academic year: {teacher.yearId.yearName}</p>
              </div>
            </div>
            <div className={`w-60 rounded-md bg-gray-400 shadow-black shadow-md p-2`}>
              <h3 className='font-bold py-3'>Detail Address</h3>
              <div className="text-left flex flex-col gap-2">
                <p><i><b>Region:</b></i> {teacher.region}</p>
                <p><i><b>City:</b></i> {teacher.city}</p>
                <p><i><b>Subcity:</b></i> {teacher.subCity}</p>
                <p><i><b>Wereda:</b></i> {teacher.wereda}</p>
                <p><i><b>House No:</b></i> {teacher.houseNo}</p>
              </div>
            </div>
            <div className="mt-3">
              {loadingInfo ? (
                <LoadingIndicator />
              ) : (
                <div className="flex flex-col gap-4">
                  {teacher.isActive && (
                    <Link className="button" to={`/main?type=teacher&Id=${teacherId}`}>Add Section</Link>
                  )}
                  {homeClass ? (
                    <div>Home Class: {homeClass.gradeId.grade}{homeClass.section}</div>
                  ) : 
                    !showHomeClassForm &&
                    (<button
                      className="button"
                      onClick={() => setShowHomeClassForm(true)}
                    >
                      Add Home Class
                    </button> )
                 }
                  {showHomeClassForm && (
                    <form onSubmit={handleAddHomeClass} className="mt-4 p-4 bg-gray-100 rounded shadow-md">
                      <h4>Select Home Class</h4>
                        {errorhome && <ErrorMessage error={errorhome}/>}
                      <select
                        value={selectedSection}
                        onChange={(e) => setSelectedSection(e.target.value)}
                        className="p-2 border rounded w-full mt-2 text-black"
                        required
                      >
                        <option value="">Select a section</option>
                        {sectionInfos.map((section) => (
                          <option className='text-black' key={section._id} value={section.sectionId}>
                            {section.gradeDetails.grade} {section.sectionDetails.section}
                          </option>
                        ))}
                      </select>
                      <div className="flex justify-end gap-2 mt-4">
                        <button
                          type="button"
                          className="button bg-red-600 text-white hover:bg-red-800 border-none p-1"
                          onClick={() => setShowHomeClassForm(false)}
                        >
                          Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="button bg-cyan-900 hover:bg-cyan-700 text-white border-none p-1">
                          Save
                        </button>
                      </div>
                    </form>
                  )}
                  {errorInfo ? (
                    <ErrorMessage error={errorInfo} />
                  ) : (
                    <div className={`${css.sectionCardContainer} flex flex-col gap-3 mt-4 w-15rem`}>
                      {sectionInfos.map((sectionInfo) => (
                        <SectionCard key={sectionInfo._id} teacherId={teacherId} role="" sectionInfo={sectionInfo} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            {teacher.isActive && (
              <div>
                {loadingInfo
                ? 
                  <LoadingIndicator />
                : 
                  !errorInfo && <UpdateTeacherSubject yearId={yearId} teacherId={teacherId} setToggle={setToggle} />
                }
              </div>
            )}
          </div>
        )}
      </div>
    )
  );
}

export default TeacherDetail;
