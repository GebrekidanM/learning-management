import React from 'react'

function SectionCard({sectionInfo,style}) {
  return (
    <div key={sectionInfo._id} style={style.sectionCardBox}>
      <h1>{sectionInfo.sections.sectionId.gradeId.grade}{sectionInfo.sections.sectionId.section}</h1>
      <p>{sectionInfo.subjectIds.map(subject=>subject.name).join(',')}</p>
    </div>
  )
}

export default SectionCard
