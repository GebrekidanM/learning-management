import React from 'react'

function CreateFamily() {
  return (
    <div>
    
    <h3>Family Members information</h3>
                {userFamilyData.map((member, index) => (
                    <div key={index} className={style.familyBox}>
                      <div className={style.inLineBox}>
                          <div className={style.info}>
                              <label>First Name:</label>
                              <input
                                  type='text'
                                  name="familyFrist"
                                  value={member.familyFrist}
                                  onChange={(e) => handleFamilyChange(index, e)}
                                  required
                              />
                          </div>
                          <div className={style.info}>
                              <label>Middle Name:</label>
                              <input
                                  type='text'
                                  name="familyMiddle"
                                  value={member.familyMiddle}
                                  onChange={(e) => handleFamilyChange(index, e)}
                                  required
                              />
                          </div>
                          <div className={style.info}>
                              <label>Last Name:</label>
                              <input
                                  type='text'
                                  name="familyLast"
                                  value={member.familyLast}
                                  onChange={(e) => handleFamilyChange(index, e)}
                                  required
                              />
                          </div>
                        </div>
                      <div className={style.inLineBox}>
                          
                          <div className={style.info}>
                              <label>Family Type:</label>
                              <input
                                  type='text'
                                  name="familyType"
                                  value={member.familyType}
                                  onChange={(e) => handleFamilyChange(index, e)}
                                  required
                              />
                          </div>
                          <div className={style.info}>
                              <label>Family Phone Number:</label>
                              <input
                                  type='number'
                                  name="familyTel"
                                  value={member.familyTel}
                                  onChange={(e) => handleFamilyChange(index, e)}
                                  min="1"
                                  required
                              />
                          </div>
                          <div className={style.info}>
                            <label>Email:</label>
                            <input type='email' 
                                   name='familyEmail' 
                                   value={member.familyEmail} 
                                   onChange={(e) => handleFamilyChange(index, e)}/>
                          </div>
                          <div className={style.info}>
                              <label>Family Photo:</label>
                              <input
                                  type='file'
                                  name="familyPhoto"
                                  onChange={(e) => handleFamilyFileChange(index, e)}
                                  accept="image/*"
                                  required
                              />
                          </div>
                        </div>
                                                
                        <button type="button" onClick={() => handleRemoveFamilyMember(index)} className={style.button}>Remove Family Member</button>
                    </div>
                ))}
                <button type="button" onClick={handleAddFamilyMember} className={style.button}>Add Family Member</button>

      
    </div>
  )
}

export default CreateFamily
