import React, { useEffect,useState } from 'react'
import SectionCard from './SectionCard'
import style from '../css/SectionTeacher.module.css'

function AddSectionSubject({teacherId}) {
    const [sectionInfos,setSectionInfos] = useState([])
    const [error,setError] = useState('')
    const [loading,setLoading] = useState(false)

    useEffect(() => {
        const fetchTeacherSections = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:4000/teacher/section/${teacherId}`);
                const json = await response.json();
                if (response.ok) {
                    setSectionInfos(json);
                } else {
                    setError(json.error || 'Failed to fetch sections');
                }
            } catch (error) {
                setError('An error occurred: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        if (teacherId) {
            fetchTeacherSections();
        }
    }, [teacherId]);
  return (
    <>
        {loading ? <p>Loading</p>
        :
        error ? <p className='error'>{error}</p>
        :
            <div>
                <p>Hello</p>
                {sectionInfos && sectionInfos.map(sectionInfo=>(
                    <SectionCard style={style} sectionInfo={sectionInfo}/>
                ))}
            </div>
        }
    </>
  )
}

export default AddSectionSubject

