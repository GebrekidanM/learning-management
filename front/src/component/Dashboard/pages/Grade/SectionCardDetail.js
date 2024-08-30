import React,{useEffect,useState} from 'react'
import style from '../css/SectionCard.module.css'
import { useNavigate } from 'react-router-dom'

function SectionCardDetail({idForDetail}) {
    const [sectionInfo, setSectionInfo] = useState(null)
    const [errorInfo, setErrorInfo] = useState('')
    const [loadingInfo, setLoadingInfo] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchTeacherSections = async () => {
            setLoadingInfo(true);
            try {
                const response = await fetch(`http://localhost:4000/medium/teacher/section/one/${idForDetail}`);
                const json = await response.json();
                if (response.ok) {
                    setSectionInfo(json);
                } else {
                    setErrorInfo(json.error || 'Failed to fetch sections');
                }
            } catch (error) {
                setErrorInfo(error.message);
            } finally {
                setLoadingInfo(false);
            }
        };
         fetchTeacherSections()
    }, [idForDetail]);

    const handleMarklist = (subjectId)=>{
        navigate(`/main?type=teacher&subjectId=${subjectId}`)
    }

  return loadingInfo ? <p className='loading'>Loading . . .</p> : (
    <div className='mt-3 w-full'>
        {sectionInfo && (
            <div className={style.title} >
                {errorInfo ? <p className='error'></p> : <>
                    <p>Grade <span className='font-semibold text-cyan-900'>{sectionInfo?.sectionId.gradeId.grade}{sectionInfo.sectionId.section}</span> 
                        <span> Subjects of</span> 
                        <span className='font-semibold text-cyan-900'> {sectionInfo.teacherId.gender === 'Male' ? 'Mr' : 'Mrs'} {sectionInfo.teacherId.first} {sectionInfo.teacherId.middle} {sectionInfo.teacherId.last}</span>
                    </p>
                    <div className='w-full'>
                        <ul className='w-full '>
                            {sectionInfo.subjects.map( subject =>(
                                <li key={subject._id}  className='m-3 flex flex-column font-bold cursor-pointer w-full '>
                                    <span className=' flex justify-content-between align-items-center border-1 p-2 border-solid border-cyan-900 border-round-sm w-full ' onClick={()=>handleMarklist(subject._id)}>
                                        {subject.name}
                                        <button className='button '>Add score</button>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </>}
                
            </div>
        )}
    </div>
  )
}

export default SectionCardDetail
