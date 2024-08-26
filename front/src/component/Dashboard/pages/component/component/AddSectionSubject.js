import React, { useEffect,useState } from 'react'
import SectionCard from './SectionCard'
import style from '../css/SectionTeacher.module.css'
import {Link} from 'react-router-dom'

function AddSectionSubject({teacherId}) {
    const [sectionInfos,setSectionInfos] = useState([])
    const [error,setError] = useState('')
    const [loading,setLoading] = useState(false)

    useEffect(() => {
        const fetchTeacherSections = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:4000/medium/teacher/section/${teacherId}`);
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

        if (teacherId) {
            fetchTeacherSections();
        }
    }, [teacherId]);

    
  return (
    <>
        {loading ? <p>Loading</p>
        :
        <div className={style.MainBox}>
            <Link className='button' to={`/main?type=teacher&Id=${teacherId}`}>Add Section</Link>
            {error ? <p className='error'>{error}</p>
               :
                <div className={style.sectionCardContainer}>
                    {sectionInfos && sectionInfos.map(sectionInfo=>(
                        <SectionCard key={sectionInfo._id} sectionInfo={sectionInfo}/>
                    ))}
                </div>
            }
        </div>
        }
    </>
  )
}

export default AddSectionSubject

