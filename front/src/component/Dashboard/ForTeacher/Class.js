import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../context/AuthContext'
import LoadingIndicator from '../../common/LoadingIndicator'
import URL from '../../UI/URL'
import ErrorMessage from '../../common/ErrorMessage'
import {Link} from "react-router-dom";

function Class() {
    const [sectionInfos,setSectionInfos] = useState([])
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState('')
    const {loggedUser} = useContext(AuthContext)


    useEffect(() => {
        const fetchTeacherSections = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${URL()}/medium/teacher/${loggedUser._id}`);
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
            sectionInfos && sectionInfos.map((sectionInfo,index)=>(
            <Link key={index} >
                <p className={'bg-cyan-900 p-3 text-white rounded'}>
                    {sectionInfo.sectionId.gradeId.grade}{sectionInfo.sectionId.section} - <span>{sectionInfo.subjects.map(subject=>(<span key={subject._id}>{subject.name},</span>))}</span>
                </p>
            </Link>
        ))}
    </div>
  )
}

export default Class
