import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import LoadingIndicator from '../../../common/LoadingIndicator';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import react-toastify styles
import URL from '../../../UI/URL';

function CreateScore({ teacherId }) {
    const [value, setValue] = useState('');
    const [outOf, setOutOf] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [round, setRound] = useState('');
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const { subjectId, studentId, first, middle } = location.state || {};
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!value || !outOf || !round || value > outOf) {
            toast.error("Please enter valid score, out of, and round values.");
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${URL()}/score`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    teacherId,
                    subjectId,
                    studentId,
                    value,
                    outOf,
                    round,
                    description,
                }),
                credentials: 'include',
            });

            const json = await response.json();
            if (response.ok) {
                toast.success('Score submitted successfully!');
                setTimeout(() => {
                    navigate(-1);
                }, 2000); 
            } else {
                setError(json.error || 'An error occurred.');
                toast.error(json.error || 'An error occurred.');
            }
        } catch (error) {
            setError('Network error: Could not submit the form.');
            toast.error('Network error: Could not submit the form.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingIndicator />;
    }

    return (
        <Card className='mt-5 py-3 w-6 mx-auto bg-cyan-900 text-white flex justify-content-center'>
            <form className='flex flex-column gap-3' onSubmit={handleSubmit}>
                <h3 className='text-center'>Result of student {first} {middle}</h3>
                {error && <p className='error'>{error}</p>}
                <div className='flex flex-column gap-2'>
                    <label htmlFor="score">Score:</label>
                    <InputNumber 
                        className='OutLine' 
                        id="score" 
                        value={value} 
                        onValueChange={(e) => setValue(e.value)} 
                        required 
                        aria-label="Score"
                    />
                </div>
                <div className='flex flex-column gap-2'>
                    <label htmlFor="outOf">Out Of:</label>
                    <InputNumber 
                        id="outOf" 
                        value={outOf} 
                        onValueChange={(e) => setOutOf(e.value)} 
                        required 
                        aria-label="Out of"
                    />
                </div>
                <div className='flex flex-column gap-2'>
                    <label htmlFor="description">Description:</label>
                    <InputText 
                        id="description" 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        aria-label="Description"
                    />
                </div>
                <div className='flex flex-column gap-2'>
                    <label htmlFor="round">Round:</label>
                    <InputNumber 
                        id="round" 
                        value={round} 
                        onValueChange={(e) => setRound(e.value)} 
                        required 
                        aria-label="Round"
                    />
                </div>
                <Button label='Submit' className='button' />
            </form>
            {/* Add ToastContainer to show toasts */}
            <ToastContainer />
        </Card>
    );
}

export default CreateScore;
