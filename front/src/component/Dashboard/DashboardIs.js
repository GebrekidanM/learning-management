import React, { useEffect, useState } from 'react';
import CreateYear from './CreateYear';
import Admin from './Admin';

function DashboardIs() {
    const [yearExists, setYearExists] = useState(null); // State to track if the academic year exists

    useEffect(() => {
        const checkYear = async () => {
            try {
                const response = await fetch('http://localhost:4000/class/check-academic-year');
                const data = await response.json();
                setYearExists(data.yearExists);
            } catch (error) {
                console.error('Failed to check academic year', error);
            }
        };

        checkYear();
    }, []);

    if (yearExists === null) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {yearExists ? (
                <Admin />
            ) : (
                <CreateYear />
            )}
        </div>
    );
}

export default DashboardIs;
