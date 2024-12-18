import React, { useState } from 'react';
import style from "../css/Createyear.module.css";
import { useNavigate } from 'react-router-dom';
import URL from '../UI/URL';

function CreateYear() {
  const [startPoint, setStartPoint] = useState('');
  const [endPoint, setEndPoint] = useState('');
  const [yearName, setYearName] = useState('');
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    // Date validation: Ensure end date is after start date
    if (new Date(startPoint) >= new Date(endPoint)) {
      setServerError('End Date must be after Start Date.');
      return;
    }

    const yearData = {
      startPoint,
      endPoint,
      yearName: parseInt(yearName),
    };

    setIsSubmitting(true);

    try {
      const response = await fetch(`${URL()}/class/create-year`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(yearData),
      });

      const json = await response.json()

      if (response.ok) {
        setStartPoint('');
        setEndPoint('');
        setYearName('');
        navigate(`/create-semester?yearId=${json._id}`)
      } else {
        setServerError(json.error || 'Failed to create year.');
      }
    } catch (error) {
      setServerError('An error occurred: ' + error.message);
    } finally {
      setIsSubmitting(false); 
    }
  };

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
          <label>Year Name (<small><i>In Ethiopian calendar</i></small>):</label>
          <input
            type="number"
            value={yearName}
            onChange={(e) => setYearName(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className={style.button}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Year'}
        </button>
      </form>
      {serverError && <div style={{ color: 'red' }}>{serverError}</div>}
    </div>
  );
}

export default CreateYear;
