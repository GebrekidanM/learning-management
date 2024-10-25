import React from 'react';
import style from '../css/delete.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS
import URL from '../../../UI/URL';

function FireTeacher({ id, onDeleteSuccess, first, middle, role, setDeleteCard }) {

    const handleDelete = async () => {
        try {
            const response = await fetch(`${URL()}/teacher/leave`, {
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ teacherId: id }),
                credentials:'include'
            });

            if (response.ok) {
                toast.success(`${role} ${first} ${middle} has been successfully fired.`);
                onDeleteSuccess(); // Call the success handler to refresh the data
            } else {
                const errorData = await response.json();
                toast.error(errorData.error || 'Failed to fire. Please try again.');
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
        }
    };

    const handleGoBack = () => {
        setDeleteCard(false);
    };

    return (
        <div className={style.deleteContainer}>
            <div className={style.deleteCard}>
                <p>Are you sure you want to fire <b>{role} {first} {middle}</b>?</p>
                <div className={style.buttonBox}>
                    <button className='button' onClick={handleDelete}>Yes</button>
                    <button className='button' onClick={handleGoBack}>No</button>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
        </div>
    );
}

export default FireTeacher;
