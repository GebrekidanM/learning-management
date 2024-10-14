import React, { useEffect, useState } from 'react';
import URL from '../../../UI/URL';
import LoadingIndicator from '../../../common/LoadingIndicator';
import ErrorMessage from '../../../common/ErrorMessage';
import { useLocation, useNavigate } from 'react-router-dom';

function AddFamily({studentId}) {
  const [families, setFamilies] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState('');
  const [familyType, setFamilyType] = useState('');
  const {name} = useLocation().state || {}
  const navigate =  useNavigate()

  useEffect(() => {
    const fetchFamilies = async () => {
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
    };
    fetchFamilies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFamily || !familyType) {
      setError('Please select a family and provide a family type');
      return;
    }
    // Call API to add the family to the student
    try {
      setLoading(true);
      const response = await fetch(`${URL()}/student/addFamily/${studentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId,
          familyId: selectedFamily,
          familyType,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error);
      } else {
        setError('');
        navigate(`/main?type=student&studentId=${studentId}`)
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <LoadingIndicator />
  ) : (
    <form className="mt-4 bg-white rounded-sm w-1/2 mx-auto p-2" onSubmit={handleSubmit}>
      <h1 className="text-center font-bold text-lg">Add Family for student {name}</h1>
      {error ? (
        <ErrorMessage error={error} />
      ) : (
        <div className="w-3/4 mx-auto flex flex-col gap-3">
          <span className="flex flex-col gap-2">
            <label>Family Type:</label>
            <input
              type="text"
              className="border rounded-sm border-gray-300"
              value={familyType}
              onChange={(e) => setFamilyType(e.target.value)}
            />
          </span>
          <span className="flex flex-col gap-2">
            <label>Select Family:</label>
            <select
              className="border rounded-sm border-gray-300 outline-none p-2"
              value={selectedFamily}
              onChange={(e) => setSelectedFamily(e.target.value)}
            >
              <option value="">Select a family</option>
              {families && families.map((family) => (
                <option key={family._id} value={family._id}>
                  {`${family.familyFirst} ${family.familyMiddle} ${family.familyLast}`}
                </option>
              ))}
            </select>
          </span>
          <button className="button" type="submit">
            Submit
          </button>
        </div>
      )}
    </form>
  );
}

export default AddFamily;
