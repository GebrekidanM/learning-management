import React, { useEffect, useState } from 'react';
import style from '../css/Edit.module.css';
import { LiaUserEditSolid } from "react-icons/lia";
import {useNavigate} from 'react-router-dom';
import LoadingIndicator from '../../../common/LoadingIndicator';
import ErrorMessage from '../../../common/ErrorMessage';
import URL from '../../../UI/URL';

function FamilyEdit({ familyId }) {
  const [familyFirst, setFamilyFirst] = useState('');
  const [familyMiddle, setFamilyMiddle] = useState('');
  const [familyLast, setFamilyLast] = useState('');
  const [familyEmail, setFamilyEmail] = useState('');
  const [familyPhone, setFamilyPhone] = useState('');
  const [familyPhoto, setFamilyPhoto] = useState('');
  const [familyType, setFamilyType] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [showFileInput, setShowFileInput] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const id = familyId;
  const navigate = useNavigate()


  useEffect(() => {
    const fetchFamily = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${URL()}/family/only/${id}`);
        const json = await response.json();
        if (response.ok) {
          setFamilyFirst(json[0].familyFirst);
          setFamilyLast(json[0].familyLast);
          setFamilyMiddle(json[0].familyMiddle);
          setFamilyEmail(json[0].familyEmail);
          setFamilyPhone(json[0].familyPhone.padStart(10, '0'));
          setFamilyPhoto(json[0].familyPhoto);
          setFamilyType(json[0].familyType);
        } else {
          setError(json.error);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFamily();
  }, [id]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFamilyPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    setShowFileInput(!showFileInput);
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault(); 

    const data = new FormData();
    data.set('familyFirst', familyFirst);
    data.set("familyLast", familyLast);
    data.set('familyMiddle', familyMiddle);
    data.set('familyEmail', familyEmail);
    data.set('familyPhone', familyPhone);
    data.set('familyType', familyType);

    if (familyPhoto instanceof File) {
      data.set('familyPhoto', familyPhoto);
    }

    try {
        const response = await fetch(`${URL()}/family/update/${familyId}`, {
            method: 'PATCH',
            body: data,
        });
        const result = await response.json();

        if (!response.ok) {
            setError(result.error);
        } else {
          navigate(-1)   
        }
    } catch (error) {
        setError(error.message);
    }
  };

  return (
    <div className={style.container}>
      {loading ? <LoadingIndicator/> :
        <form  onSubmit={handleSubmit}>
          {error && <ErrorMessage error={error}/>}
          <div className={`${style.basicInfo}`}>
            <span className={`${style.imageHolder}`}>
              <img src={imagePreview == null ? `${URL()}/uploads/${familyPhoto}` : imagePreview} alt='Profile' />
              {showFileInput && <input type='file' accept='image/*' onChange={handleFileChange} />}
              <span className={style.clickEdit} onClick={handleClick}>{<LiaUserEditSolid />}</span>
            </span>
          
            <div className={style.extraInfo}>
              <span className={style.name}>
                <p><b>First Name:</b></p>
                <input
                  type='text'
                  value={familyFirst}
                  onChange={e => setFamilyFirst(e.target.value)}
                />
              </span>
              <span className={style.name}>
                <p><b>Middle Name:</b></p>
                <input
                  type='text'
                  value={familyMiddle}
                  onChange={e => setFamilyMiddle(e.target.value)}
                />
              </span>
              <span className={style.name}>
                <p><b>Last Name:</b></p>
                <input
                  type='text'
                  value={familyLast}
                  onChange={e => setFamilyLast(e.target.value)}
                />
              </span>
              <span className={style.name}>
                <p><b>Family Type:</b></p>
                <input
                  type='text'
                  value={familyType}
                  onChange={e => setFamilyType(e.target.value)}
                />
              </span>
              <span className={style.name}>
                <p><b>Phone no:</b> </p>
                <input
                  type='text'
                  value={familyPhone}
                  onChange={e => setFamilyPhone(e.target.value)}
                />
              </span>
              <span className={style.name}>
                <p><b>Email:</b></p>
                <input
                  type='email'
                  value={familyEmail}
                  onChange={e => setFamilyEmail(e.target.value)}
                />
              </span>
              <span style={{ fontSize: '0.8rem', color: 'blue', fontStyle: 'italic', marginBottom: '1rem' }}>** Click on where you want to edit</span>
              <button className='button' style={{ width: '50%' }} type='submit'>Update</button>
            </div>
          </div>
        </form>
      }
    </div>
  )
}

export default FamilyEdit;