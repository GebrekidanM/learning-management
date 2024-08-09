import React, { useState } from 'react';
import style from "../css/Createyear.module.css"
import { Navigate } from 'react-router-dom';

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
  if(successMessage){
    return <Navigate to={'/main'}/>
  }

  return (
    <div className={style.yearContainer}>
      <h2>Create a New Academic Year</h2>
      <form onSubmit={handleSubmit}>
        <div className={style.info}>
          <label>Start Date:</label>
          <input
            type="date"
            value={startPoint}
            onChange={(e) => setStartPoint(e.target.value)}
            required
          />
        </div>
        <div className={style.info}>
          <label>End Date:</label>
          <input
            type="date"
            value={endPoint}
            onChange={(e) => setEndPoint(e.target.value)}
            required
          />
        </div>
        <div className={style.info}>
          <label>Year Name(<small><i>In ethiopian calander</i></small>):</label>
          
          <input
            type="number"
            value={yearName}
            onChange={(e) => setYearName(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={style.button}>Create Year</button>
      </form>
      {serverError && <div style={{ color: 'red' }}>{serverError}</div>}
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
    </div>
  );
}

export default CreateYear;


