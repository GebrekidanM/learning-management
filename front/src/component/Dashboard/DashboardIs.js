import React, { useEffect, useState } from 'react';
import CreateYear from './CreateYear';
import Admin from './Admin';

function DashboardIs() {
    const [yearExists, setYearExists] = useState(false);
    const [loading,setLoading] = useState(true)

    useEffect(() => {
        const checkYear = async () => {
            try {
                const response = await fetch('http://localhost:4000/class/check-academic-year');
                const data = await response.json();
                if(response.ok){
                    setYearExists(data);
                }
            } catch (error) {
                console.log(error)
            }finally{
                setLoading(false)
            }
        };

        checkYear();
    }, []);

    const handleCreateYear = () => {
        setYearExists(false);
    };

    return (
        <div>
            {loading ? <p className='loading'>loading . . .</p>:
                yearExists ? <Admin year={handleCreateYear} /> : <CreateYear />
            }
        </div>
    );
}

export default DashboardIs;
