import React, { useEffect, useState } from 'react';
import CreateYear from './CreateYear';
import Admin from './Admin';
import LoadingIndicator from '../common/LoadingIndicator';
import URL from '../UI/URL';
import ErrorMessage from '../common/ErrorMessage';
import { useLocation } from 'react-router-dom';

function DashboardIs() {
    const [yearExists, setYearExists] = useState(false);
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState('')
    const location = useLocation()
    const {yearId,semesterId} = location.state || {}

    useEffect(() => {
        const checkYear = async () => {
            try {
                setLoading(true)
                const response = await fetch(`${URL()}/class/check-academic-year`);
                const data = await response.json();
                if(response.ok){
                    setYearExists(data);
                }
            } catch (error) {
                setError(error)
            }finally{
                setLoading(false)
            }
        };
        if(!yearId){
            checkYear();
        }else{
            setYearExists(true)
        }
        
    }, []);

    const handleCreateYear = () => {
        setYearExists(false);
    }

    if(loading){
        return <LoadingIndicator/>
    }

    if(error){
        return <ErrorMessage error={error}/>
    }

    return (
        <div>
            {yearExists ? <Admin year={handleCreateYear} yearId={yearId} semesterId={semesterId} /> : <CreateYear />}
        </div>
    );
}

export default DashboardIs;
