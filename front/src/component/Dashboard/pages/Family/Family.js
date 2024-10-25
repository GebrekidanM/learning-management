import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Delete from '../Delete/Delete';
import LoadingIndicator from '../../../common/LoadingIndicator';
import ErrorMessage from '../../../common/ErrorMessage';
import URL from '../../../UI/URL';

const Family = ({ yearName }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [families, setFamilies] = useState(null);
  const [deleteCard, setDeleteCard] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [selectedFamilyId, setSelectedFamilyId] = useState('');
  const navigate = useNavigate();
  const [onlyFamily , setOnlyFamily] = useState(true)

  const fetchFamilies = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${URL()}/families`);
      const json = await response.json();
      if (response.ok) {
        setFamilies(json);
      } else {
        setError(json.error);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const fetchOnlyFamilies = async () =>{
    try {
      setLoading(true);
      const response = await fetch(`${URL()}/onlyfamilies`);
      const json = await response.json();
      if (response.ok) {
        setFamilies(json);
      } else {
        setError(json.error);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (onlyFamily) {
      fetchOnlyFamilies()
    }else{
      fetchFamilies();
    }
  }, [onlyFamily]);

  // Refetch families when delete is successful
  useEffect(() => {
    if (onlyFamily) {
      fetchOnlyFamilies()
    }else{
      fetchFamilies();
    }
  }, [refreshTrigger,onlyFamily]);

  const handleDeleteCard = (familyId) => {
    setSelectedFamilyId(familyId);
    setDeleteCard(true);
  };

  const handleDeleteSuccess = () => {
    setDeleteCard(false);
    setRefreshTrigger((prev) => !prev); // Toggle refresh trigger
  };

  const handleCreateFamily = () => {
    navigate(`/main?type=parent&addfamily=${yearName}`);
  };

  const onClickOnlyFamily = ()=>{
    setFamilies(null)
    setOnlyFamily(prev=>!prev)
  }

  return (
    <div className={'mt-4'}>
      <div className='mb-4 flex justify-between'>
        <div className='button' onClick={onClickOnlyFamily}>
          {!onlyFamily ? "Only Family" : "Family with Students"}
        </div>
        <h1 className="button " onClick={handleCreateFamily}>
          Add Family
        </h1>
      </div>
      {onlyFamily
        ?
        <table  className="w-full">
          <thead>
            <tr>
              <th>No</th>
              <th>Family Name</th>
              <th colSpan={'3'}>Action</th>
            </tr>
          </thead>
          {loading && <LoadingIndicator />}
          {error && <ErrorMessage error={error} />}

          {families && 
                <tbody>
                  {families?.map((family, index) => (
                    <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            {family.familyFirst} {family.familyMiddle}
                          </td>
                          <td className={'delete'} onClick={() => handleDeleteCard(family._id)}>Delete</td>
                          <td className={'edit'}>
                            <Link to={`/main?type=parent&action=${family._id}`}>Edit</Link>
                          </td>
                          <td className={'view'}>
                            <Link to={`/main?type=parent&familyId=${family._id}`}>View</Link>
                          </td>
                    </tr>
                  ))}
                </tbody>
            }
        </table>
      :
        <table className="w-full">
          <thead>
            <tr>
              <th>No</th>
              <th>Family Name</th>
              <th>Student Name</th>
              <th>Family Type</th>
              <th colSpan={'3'}>Action</th>
            </tr>
          </thead>

          {loading && <LoadingIndicator />}
          {error && <ErrorMessage error={error} />}

          {families && Object.keys(families).length > 0 &&
            Object.keys(families).map((familyId, index) => {
              const family = families[familyId];
              return (
                <tbody key={familyId}>
                  {family.students.map((student, studentIndex) => (
                    <tr key={studentIndex}>
                      {/* Show family info only in the first row for the family */}
                      {studentIndex === 0 && (
                        <>
                          <td rowSpan={family.students.length}>{index + 1}</td>
                          <td rowSpan={family.students.length}>
                            {family.familyDetails.familyFirst} {family.familyDetails.familyMiddle}
                          </td>
                        </>
                      )}
                      {/* Display student info */}
                      <td>
                        {student.first} {student.middle} {student.last}
                      </td>
                      {/* Show family type only in the first row for the family */}
                      {studentIndex === 0 && (
                        <>
                          <td rowSpan={family.students.length}>{family.familyType}</td>
                          <td rowSpan={family.students.length} className={'delete'} onClick={() => handleDeleteCard(familyId)}>Delete</td>
                          <td rowSpan={family.students.length} className={'edit'}>
                            <Link to={`/main?type=parent&action=${familyId}`}>Edit</Link>
                          </td>
                          <td rowSpan={family.students.length} className={'view'}>
                            <Link to={`/main?type=parent&familyId=${familyId}`}>View</Link>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              );
            })}
        </table>
      }
      {deleteCard && (
        <Delete
          setDeleteCard={setDeleteCard}
          first={families[selectedFamilyId]?.familyDetails.familyFirst}
          middle={families[selectedFamilyId]?.familyDetails.familyMiddle}
          id={selectedFamilyId}
          role={'family'}
          onDeleteSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
};

export default Family;
