import React,{useEffect,useState} from 'react'
import style from '../css/SectionCard.module.css'


function SectionCardDetail({teacherId}) {
    const [sectionInfos,setSectionInfos] = useState([])
    const [errorInfo,setErrorInfo] = useState('')
    const [loadingInfo,setLoadingInfo] = useState(false)

    useEffect(() => {
        const fetchTeacherSections = async () => {
            setLoadingInfo(true);
            try {
                const response = await fetch(`http://localhost:4000/medium/teacher/section/${teacherId}`);
                const json = await response.json();
                if (response.ok) {
                    setSectionInfos(json);
                } else {
                    setErrorInfo(json.error || 'Failed to fetch sections');
                }
            } catch (error) {
                setErrorInfo(error.message);
            } finally {
                setLoadingInfo(false);
            }
        };

        if (teacherId) {
            fetchTeacherSections();
        }
    }, [teacherId]);
  return (
    <div className={style.Box}>
      
    </div>
  )
}

export default SectionCardDetail
