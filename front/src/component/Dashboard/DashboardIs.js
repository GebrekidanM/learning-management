import React, { useEffect, useState } from 'react';
import CreateYear from './CreateYear';
import Admin from './Admin';
import LoadingIndicator from '../common/LoadingIndicator';
import URL from '../UI/URL';
import ErrorMessage from '../common/ErrorMessage';
import { useLocation } from 'react-router-dom';

function DashboardIs() {
    const [yearExists, setYearExists] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [yearName,setYearName] = useState('')
    const [semester, setSemester] = useState('');
    const location = useLocation();
    const { yearId, semesterId } = location.state || {};
    
    // Effect to check if a year exists or set based on location state
    useEffect(() => {
        const checkYear = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${URL()}/class/check-academic-year`);
                const data = await response.json();
                
                if (response.ok) {
                    setYearExists(data.yearId);
                    setYearName(data.yearName);
                } else {
                    setError(data.error || 'Failed to fetch academic year data.');
                }
            } catch (error) {
                setError(error.message || 'An error occurred while checking the academic year.');
            } finally {
                setLoading(false);
            }
        };

        // Check for year existence only if yearId is not provided in location state
        if (!yearId) {
            checkYear();
        } else {
            setYearExists(yearId);
        }
    }, [yearId]);

    // Effect to fetch the latest semester for the specified or existing year
    useEffect(() => {
        const fetchSemester = async () => {
            if (!yearId && !yearExists) return;

            setLoading(true);
            try {
                const response = await fetch(`${URL()}/class/semester/${yearId || yearExists}`);
                const data = await response.json();

                if (response.ok) {
                    setSemester(data._id);
                } else {
                    setError(data.error || 'Failed to fetch semester data.');
                }
            } catch (error) {
                setError(error.message || 'An error occurred while fetching the semester.');
            } finally {
                setLoading(false);
            }
        };

        // Fetch the semester only if semesterId is not provided in location state
        if (!semesterId) {
            fetchSemester();
        } else {
            setSemester(semesterId);
        }
    }, [semesterId, yearId, yearExists]);

    const handleCreateYear = () => {
        setYearExists(false);
    };

    if (loading) {
        return <LoadingIndicator />;
    }

    if (error) {
        return <ErrorMessage error={error} />;
    }

    return (
        <div>
            {yearExists 
            ?
                (
                    <Admin 
                        year={handleCreateYear} 
                        yearId={yearId || yearExists} 
                        semesterId={semester} 
                        yearName={yearName}
                    />
                ) 
            :
            (
                <CreateYear />
            )}
        </div>
    );
}

export default DashboardIs;
