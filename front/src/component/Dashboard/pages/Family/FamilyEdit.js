import React, { useEffect, useState } from 'react';
import style from '../css/Edit.module.css';
import { LiaUserEditSolid } from "react-icons/lia";
import {useNavigate} from 'react-router-dom';
import { z } from 'zod';

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
  const [validationErrors, setValidationErrors] = useState({});
  const id = familyId;
  const navigate = useNavigate()


  useEffect(() => {
    const fetchFamily = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:4000/member/family/only/${id}`);
        const json = await response.json();
        if (response.ok) {
          setFamilyFirst(json[0].familyFirst);
          setFamilyLast(json[0].familyLast);
          setFamilyMiddle(json[0].familyMiddle);
          setFamilyEmail(json[0].familyEmail);
          setFamilyPhone(json[0].familyPhone);
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

  // Zod schema for validation
  const familySchema = z.object({
    familyFirst: z.string().min(1, 'First name is required'),
    familyMiddle: z.string().min(1, 'Middle name is required'),
    familyLast: z.string().min(1, 'Last name is required'),
    familyEmail: z.string().email('Invalid email address'),
    familyPhone: z.number().min(9, 'Phone number must be at least 10 digits'),
    familyType: z.string().min(1, 'Family type is required'),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = {
      familyFirst,
      familyMiddle,
      familyLast,
      familyEmail,
      familyPhone,
      familyType,
    };

    const result = familySchema.safeParse(formData);
    
    if (!result.success) {
      // If validation fails, set the errors to display
      const errors = result.error.formErrors.fieldErrors;
      setValidationErrors(errors);
      return;
    }

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
        const response = await fetch(`http://localhost:4000/member/family/update/${familyId}`, {
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
    // Perform the submission logic (e.g., sending data to server)
  };

  return (
    <div className={style.container}>
      {loading ? <p>Loading...</p> :
        <form  onSubmit={handleSubmit}>
          {error && <p className='error'>{error}</p>}
          <div className={style.basicInfo}>
            <span className={style.imageHolder}>
              <img src={imagePreview == null ? `http://localhost:4000/uploads/${familyPhoto}` : imagePreview} alt='Profile' />
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
                {validationErrors.familyFirst && <p className={style.error}>{validationErrors.familyFirst}</p>}
              </span>
              <span className={style.name}>
                <p><b>Middle Name:</b></p>
                <input
                  type='text'
                  value={familyMiddle}
                  onChange={e => setFamilyMiddle(e.target.value)}
                />
                {validationErrors.familyMiddle && <p className={style.error}>{validationErrors.familyMiddle}</p>}
              </span>
              <span className={style.name}>
                <p><b>Last Name:</b></p>
                <input
                  type='text'
                  value={familyLast}
                  onChange={e => setFamilyLast(e.target.value)}
                />
                {validationErrors.familyLast && <p className={style.error}>{validationErrors.familyLast}</p>}
              </span>
              <span className={style.name}>
                <p><b>Family Type:</b></p>
                <input
                  type='text'
                  value={familyType}
                  onChange={e => setFamilyType(e.target.value)}
                />
                {validationErrors.familyType && <p className={style.error}>{validationErrors.familyType}</p>}
              </span>
              <span className={style.name}>
                <p><b>Phone no:</b> </p>
                <input
                  type='text'
                  value={familyPhone}
                  onChange={e => setFamilyPhone(e.target.value)}
                />
                {validationErrors.familyPhone && <p className={style.error}>{validationErrors.familyPhone}</p>}
              </span>
              <span className={style.name}>
                <p><b>Email:</b></p>
                <input
                  type='email'
                  value={familyEmail}
                  onChange={e => setFamilyEmail(e.target.value)}
                />
                {validationErrors.familyEmail && <p className={style.error}>{validationErrors.familyEmail}</p>}
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