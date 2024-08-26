import React from 'react'
import style from '../css/SectionCard.module.css'
function SectionCard({sectionInfo,key}) {
  return (
    <div key={key} className={style.sectionCard}>

      <h1>{sectionInfo.gradeDetails.grade}{sectionInfo.sectionDetails.section}</h1>
      <p>{sectionInfo.subjectDetails.map(subject=>subject.name).join(',')}</p>

    </div>
  )
}

export default SectionCard
