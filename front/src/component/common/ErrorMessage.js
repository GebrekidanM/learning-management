import React from 'react';
import { Message } from 'primereact/message';

const ErrorMessage = ({ error }) => {
    return (
        <div className='w-full h-full flex justify-content-center align-items-center '>
            <Message severity="error" text={error} />
        </div>
    );
};

export default ErrorMessage;
