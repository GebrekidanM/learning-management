import React,{useState} from 'react'
import style from '../css/SectionCard.module.css'
import { MdDeleteForever } from "react-icons/md";
import DeleteSection from '../delete/DeleteSection';

function SectionCard({sectionInfo,teacherId}) {
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [showDeleteCard,setShowDeleteCard] = useState(false)
  const [selectedSectionInfoId,setSelectedSectionInfoId] = useState('')

  const handleDeleteCard = (sectionInfoId)=>{
    setSelectedSectionInfoId(sectionInfoId)
    setShowDeleteCard(true)
  }
  return (
    <div  className={style.sectionCard}>
      <h1>{sectionInfo.gradeDetails.grade}{sectionInfo.sectionDetails.section}</h1>
      <p>{sectionInfo.subjectDetails.map(subject=>subject.name).join(' , ')}</p>
      <p className={style.subNumber}>{sectionInfo.subjectDetails.length}</p>
      <div className={style.delete} onClick={()=>handleDeleteCard(sectionInfo._id)}>
          {<MdDeleteForever/>}
      </div>
      {showDeleteCard && <DeleteSection
        id={selectedSectionInfoId}
        
      />}
    </div>
  )
}

export default SectionCard
