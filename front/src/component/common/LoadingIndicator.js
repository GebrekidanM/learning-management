import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';

const LoadingIndicator = () => {
    return (
        <div className='w-full h-full flex justify-content-center align-items-center'>
            <ProgressSpinner />
        </div>
    );
};

export default LoadingIndicator;