import style from '../css/SectionCard.module.css'
import { useNavigate } from 'react-router-dom'

function SectionCard({sectionInfo}) {
  const navigate = useNavigate()
const handleShowDetail = ()=>{
  navigate(`/main?type=teacher&detail=${sectionInfo._id}`)
}

  return (
    <div  className={style.sectionCard} onClick={()=>handleShowDetail(sectionInfo)}>
      <h1>{sectionInfo.gradeDetails.grade}{sectionInfo.sectionDetails.section}</h1>
      <p>{sectionInfo.subjectDetails.map(subject=>subject.name).join(' , ')}</p>
      <p className={style.subNumber}>{sectionInfo.subjectDetails.length}</p>
    </div>
  )
}

export default SectionCard
