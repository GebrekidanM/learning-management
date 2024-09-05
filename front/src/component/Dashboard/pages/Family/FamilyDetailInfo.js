import React from 'react'
import URL from '../../../UI/URL'
function FamilyDetailInfo({fam,student,style}) {
  return (
    <div key={fam._id} className={style.basicInfo}>
        <img src={`${URL()}/uploads/${fam.familyPhoto}`} alt={fam._familyFirst}/>
        <h4>{student.first}'s {fam.familyType}</h4>
        <div className={style.extraInfo}>
            <h5>{fam.familyFirst} {fam.familyMiddle} {fam.familyLast}</h5>
            <p>Email: {fam.familyEmail}</p>
            <p>Phone: {fam.familyPhone}</p>
        </div>
    </div>
  )
}

export default FamilyDetailInfo
