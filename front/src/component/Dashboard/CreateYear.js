import React, { useState } from 'react';

function CreateYear() {
  const [startPoint, setStartPoint] = useState('');
  const [endPoint, setEndPoint] = useState('');
  const [yearName, setYearName] = useState('');
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccessMessage('');

    const yearData = {
      startPoint,
      endPoint,
      yearName: parseInt(yearName),
    };

    try {
      const response = await fetch('http://localhost:4000/class/create-year', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(yearData),
      });

      if (response.ok) {
        setSuccessMessage('Year created successfully!');
        setStartPoint('');
        setEndPoint('');
        setYearName('');
      } else {
        const json = await response.json();
        setServerError(json.error || 'Failed to create year.');
      }
    } catch (error) {
      setServerError('An error occurred: ' + error.message);
    }
  };

  return (
    <div>
      <h2>Create a New Year</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Start Date:</label>
          <input
            type="date"
            value={startPoint}
            onChange={(e) => setStartPoint(e.target.value)}
            required
          />
        </div>
        <div>
          <label>End Date:</label>
          <input
            type="date"
            value={endPoint}
            onChange={(e) => setEndPoint(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Year Name:</label>
          <input
            type="number"
            value={yearName}
            onChange={(e) => setYearName(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Year</button>
      </form>
      {serverError && <div style={{ color: 'red' }}>{serverError}</div>}
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
    </div>
  );
}

export default CreateYear;


