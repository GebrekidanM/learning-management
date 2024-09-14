import React, { useContext, useEffect, useState } from 'react'
import SectionCard from '../pages/Grade/SectionCard'
import { AuthContext } from '../../../context/AuthContext'
import LoadingIndicator from '../../common/LoadingIndicator'
import URL from '../../UI/URL'
import ErrorMessage from '../../common/ErrorMessage'

function Class() {
    const [sectionInfos,setSectionInfos] = useState([])
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState('')
    const {loggedUser} = useContext(AuthContext)


    useEffect(() => {
        const fetchTeacherSections = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${URL()}/medium/teacher/section/${loggedUser._id}`);
                const json = await response.json();
                if (response.ok) {
                    setSectionInfos(json);
                } else {
                    setError(json.error || 'Failed to fetch sections');
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (loggedUser.role === 'Teacher') {
            fetchTeacherSections();
        }
    }, [loggedUser]);
    if(loading){
      return <LoadingIndicator/>
    }
  return (
    <div className={'w-20rem mt-3'}>
        {error ? <ErrorMessage error={error}/>:
            sectionInfos && sectionInfos.map(sectionInfo=>(
            <SectionCard key={sectionInfo._id} teacherId={loggedUser._id} active={loggedUser.isActive}   sectionInfo={sectionInfo}/>
        ))}
    </div>
  )
}

export default Class
