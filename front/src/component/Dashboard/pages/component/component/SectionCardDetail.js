import React,{useEffect,useState} from 'react'
import style from '../css/SectionCard.module.css'


function SectionCardDetail({idForDetail}) {
    const [sectionInfo,setSectionInfo] = useState(null)
    const [errorInfo,setErrorInfo] = useState('')
    const [loadingInfo,setLoadingInfo] = useState(false)


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


  return (
    <div className='mt-3'>
        {sectionInfo && (
            <div className={style.title} >
                <p>Grade <span className='font-semibold text-cyan-900'>{sectionInfo?.sectionId.gradeId.grade}{sectionInfo.sectionId.section}</span> 
                    <span> Subjects of</span> 
                    <span className='font-semibold text-cyan-900'> {sectionInfo.teacherId.gender === 'Male' ? 'Mr' : 'Mrs'} {sectionInfo.teacherId.first} {sectionInfo.teacherId.middle} {sectionInfo.teacherId.last}</span>
                </p>
                <div>
                    <ul>
                        {sectionInfo.subjects.map(subject=>(
                            <li key={subject._id} className=''>
                                <span className='bg-cyan-900 p-3 text-900'>{subject.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        )}
    </div>
  )
}

export default SectionCardDetail
