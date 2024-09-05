import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import style from "../css/Createyear.module.css";
import URL from '../UI/URL'
import ErrorMessage from '../common/ErrorMessage'
import { Card } from 'primereact/card';

function CreateSemester() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [name, setName] = useState('');
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams()
  const yearId = searchParams.get('yearId')

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    // Date validation: Ensure end date is after start date
    if (new Date(startDate) >= new Date(endDate)) {
      setServerError('End Date must be after Start Date.');
      return;
    }
    
    setIsSubmitting(true);

    try {
      const response = await fetch(`${URL()}/class/semester/create`, { 
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({yearId,startDate,endDate, name: parseInt(name)})
            });
       const json = await response.json();

      if (response.ok) {
            setStartDate('');
            setEndDate('');
            setName('');
            navigate('/main',{state:{yearId,semesterId:json.createdSemester._id}}); 
        } else {
            setServerError(json.error || 'Failed to create semester.');
        }
    } catch (error) {
      setServerError('An error occurred: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className='w-4 mt-3 mx-auto bg-cyan-900'>
      <h2 className='text-white text-center'>Create a New Semester</h2>
      <form onSubmit={handleSubmit} className='flex flex-column gap-3 w-10 mx-auto'>
        <div className={style.info}>
          <label>Start Date:</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required/>
        </div>
        <div className={style.info}>
          <label>End Date:</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required/>
        </div>
        <div className={style.info}>
          <label>Semester Name:</label>
          <input type="number" value={name} onChange={(e) => setName(e.target.value)} required/>
        </div>
        
        <button type="submit" className='button' disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Semester'}
        </button>
      </form>
      {serverError && <ErrorMessage error={serverError}/> }
    </Card>
  );
}

export default CreateSemester;
