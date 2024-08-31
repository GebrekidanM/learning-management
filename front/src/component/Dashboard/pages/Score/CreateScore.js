import React,{useState} from 'react'
import { useLocation } from 'react-router-dom';
import {InputNumber} from "primereact/inputnumber"
import {InputText} from "primereact/inputtext"
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import LoadingIndicator from '../../../common/LoadingIndicator';
import ErrorMessage from '../../../common/ErrorMessage';



function CreateScore({teacherId}) {
    const [value,setValue] = useState('')
    const [outOf,setOutOf] = useState('')
    const [description,setDescription] = useState('')
    const [error,setError] = useState('')
    const [loading,setLoading] = useState(false)
    const location = useLocation();
    const { subjectId, studentId ,first,middle,sectionId} = location.state|| {};

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:4000/score', { // Replace with your API endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    teacherId,
                    subjectId,
                    studentId,
                    sectionId,
                    value,
                    outOf,
                    description,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to submit score');
            }

            // Handle successful submission

        } catch (error) {
            setError(error.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };
    if(loading){
        return <LoadingIndicator/>
    }
    
  return (
    <Card className='mt-5 w-6 mx-auto bg-cyan-900 text-white flex justify-content-center'>
        <form className='flex flex-column gap-3' onSubmit={handleSubmit}>
              <h3 className='text-center'>Result of student {first} {middle}</h3>
              {error && <ErrorMessage error={error}/>}
              <div className='flex flex-column gap-2'>
                  <label htmlFor="score">Score:</label>
                  <InputNumber className='OutLine' id="score" value={value} onValueChange={(e) => setValue(e.value)} />
              </div>
              <div className='flex flex-column gap-2'>
                    <label htmlFor="outOf">OutOf</label>
                    <InputNumber style={{ borderColor: 'cyan-900' }} id="outOf" value={outOf} onValueChange={(e) => setOutOf(e.value)} />
              </div>
              <div className='flex flex-column gap-2'>
                    <label htmlFor="description">Description</label>
                    <InputText style={{ border: '1px solid cyan-900' }} id="description" value={description} onChange={(e) => setDescription(e.target.value)}/>
              </div>
              <Button label='Submit' className='button'/>
        </form>
    </Card> 
  )
}

export default CreateScore
