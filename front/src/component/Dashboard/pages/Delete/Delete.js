import React from 'react';
import style from '../css/delete.module.css';
import URL from '../../../UI/URL';

function Delete({ first, middle, role, id, setDeleteCard, onDeleteSuccess }) {

    const handleDelete = async () => {
        try {
            const response = await fetch(`${URL()}/member/delete/${id}`, {
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
                    <button className='button' onClick={handleDelete}>Yes, Delete</button>
                    <button className='button' onClick={handleGoBack}>No, Go Back</button>
                </div>
            </div>
        </div>
    );
}

export default Delete;