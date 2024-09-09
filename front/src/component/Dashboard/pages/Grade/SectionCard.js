import style from '../css/SectionCard.module.css'
import { useNavigate } from 'react-router-dom'

function SectionCard({sectionInfo,active}) {
  const navigate = useNavigate();

  const handleShowDetail = () => {
    if(sectionInfo){
      navigate(`/main?type=teacher&idForDetail=${sectionInfo._id}`);
    }
  }

  return (
    active
    ? 
    <div className={style.sectionCard} onClick={handleShowDetail}>
      <h1>{sectionInfo.gradeDetails.grade}{sectionInfo.sectionDetails.section}</h1>
      <p>{sectionInfo.subjectDetails.map(subject => subject.name).join(' , ')}</p>
      <p className={style.subNumber}>{sectionInfo.subjectDetails.length}</p>
    </div>
    :
    <div className={style.sectionCard}>
      <h1>{sectionInfo.gradeDetails.grade}{sectionInfo.sectionDetails.section}</h1>
      <p>{sectionInfo.subjectDetails.map(subject => subject.name).join(' , ')}</p>
      <p className={style.subNumber}>{sectionInfo.subjectDetails.length}</p>
    </div>
  );
}

export default SectionCard;
