import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Delete from '../Delete/Delete';
import LoadingIndicator from '../../../common/LoadingIndicator';
import ErrorMessage from '../../../common/ErrorMessage';
import URL from '../../../UI/URL';

const Family = ({ yearName }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [families, setFamilies] = useState({});
  const [deleteCard, setDeleteCard] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [selectedFamilyId, setSelectedFamilyId] = useState('');
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchFamilies();
  }, []);

  // Refetch families when delete is successful
  useEffect(() => {
    fetchFamilies();
  }, [refreshTrigger]);

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

  return (
    <div className={'mt-4'}>
      <div>
        <h1 className="button mb-4" onClick={handleCreateFamily}>
          Add Family
        </h1>
      </div>
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
