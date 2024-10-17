import { Card } from 'primereact/card';
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import URL from '../../../UI/URL'; // Ensure this import is correct

function CreateSubject({ sectionId, setRefresh, setCardForSubject }) {
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Split input into an array of subject names
    const subjectArray = subjects.split(',').map(name => name.trim()).filter(name => name);
    if (!subjectArray.length) {
      toast.error('Please enter at least one subject name!');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${URL()}/subject/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionId, name: subjectArray }),
        credentials:"include"
      });
      const json = await response.json();
      if (!response.ok) {
        toast.error(json.error || 'Failed to create subjects.');
      } else {
        toast.success('Subjects created successfully!');
        setSubjects(''); // Clear input field after successful submission
        setTimeout(() => {
            setRefresh(prev => !prev);
            setCardForSubject(false);
          }, 4000);
      }
    } catch (error) {
      toast.error(`An error occurred: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Card className="w-4 p-4 bg-cyan-900 align-self-start mt-6 flex flex-column justify-center text-center text-white subjectAdd">
        <h2 className='font-bold text-xl'>Add Subjects</h2>
        <form onSubmit={handleSubmit} className=''>
          <div className="flex flex-column gap-3">
            <label htmlFor="subjects" className='text-left'>Subjects:</label>
            <input
              id="subjects"
              value={subjects}
              onChange={e => setSubjects(e.target.value)}
              className="w-full p-3 "
              placeholder="Enter subject names, separated by commas"
            />
            <small id="subject-help">
              Enter subject names, separated by commas.
            </small>
          </div>
          <button
            className={`button hover:bg-cyan-900 ${loading ? 'bg-cyan-900 cursor-wait' : 'bg-yellow-700'} mt-3 w-full`}
            type='submit'
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create'}
          </button>
        </form>
      </Card>
    </>
  );
}

export default CreateSubject;
