import React from 'react';
import style from '../css/delete.module.css';
import URL from '../../../UI/URL';

function Delete({ first, middle, role, id, setDeleteCard, onDeleteSuccess }) {

    const handleDelete = async () => {
        try {
            const response = await fetch(`${URL()}/delete/${id}`, {
                method: "DELETE"
            });

            if (response.ok) {
                onDeleteSuccess();  // Call the success handler to refresh the data
            } else {
                alert('Failed to delete. Please try again.');
            }
        } catch (error) {
            alert('An error occurred. Please try again.');
        }
    };

    const handleGoBack = () => {
        setDeleteCard(false);
    };

    return (
        <div className={style.deleteContainer}>
            <div className={style.deleteCard}>
                <p>Are you sure you want to delete <b>{role} {first} {middle}</b>?</p>
                <div className={style.buttonBox}>
                    <button className='button border border-cyan-950 text-yellow-700 bg-white hover:bg-cyan-900' onClick={handleDelete}>Yes, Delete</button>
                    <button className='button border border-cyan-950 text-yellow-700 bg-white hover:bg-cyan-900' onClick={handleGoBack}>No, Go Back</button>
                </div>
            </div>
        </div>
    );
}

export default Delete;