import React from 'react'
import URL from '../../../UI/URL'
function FamilyDetailInfo({fam,student,style}) {
  
  return (
    <div key={fam.family._id} className={style.basicInfo}>
        <img src={`${URL()}/uploads/${fam.family.familyPhoto}`} alt={fam.family.familyFirst}/>
        <h4 className='font-bold p-1'>{student.first}'s {fam.type}</h4>
        <div className={`${style.extraInfo} ml-2`}>
            <h5>{fam.family.familyFirst} {fam.family.familyMiddle} {fam.family.familyLast}</h5>
            <p>Email: {fam.family.familyEmail}</p>
            <p>Phone: {fam.family.phoneNo}</p>
        </div>
    </div>
  )
}

export default FamilyDetailInfo
