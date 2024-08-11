import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import style from '../css/pages.module.css';

function CreateStudent({ sectionId }) {
  const [userData, setUserData] = useState({
    first: '',
    middle: '',
    last: '',
    gender: '',
    age: '',
    region: '',
    city: '',
    subCity: '',
    wereda: '',
    houseNo: '',
    familyTel: '',
    sectionId: sectionId || ''
  });

  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const errors = {};
    const namePattern = /^[a-zA-Z\s]+$/; // Regex pattern for letters and spaces

    if (!userData.first.trim()) errors.first = 'First name is required';
    else if (!namePattern.test(userData.first)) errors.first = 'First name must contain only characters';

    if (!userData.last.trim()) errors.last = 'Last name is required';
    else if (!namePattern.test(userData.last)) errors.last = 'Last name must contain only characters';

    if (!userData.gender) errors.gender = 'Gender is required';

    if (!userData.age || userData.age <= 0) errors.age = 'Age must be a positive number';

    if (!userData.familyTel.match(/^\d{10}$/)) errors.familyTel = 'Family phone number must be 10 digits';

    if (!userData.region.trim()) errors.region = 'Region/State is required';
    if (!userData.city.trim()) errors.city = 'City is required';
    if (!userData.subCity.trim()) errors.subCity = 'Subcity/Zone is required';
    if (!userData.wereda.trim()) errors.wereda = 'Wereda is required';
    if (!userData.houseNo.trim()) errors.houseNo = 'House No. is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true); // Disable button and show loading state

    try {
      const response = await fetch('http://localhost:4000/member/', {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: { 'Content-Type': 'application/json' }
      });

      const json = await response.json();

      if (response.ok) {
        navigate(`/main?type=student&studentId=${json.createStudent._id}`);
      } else {
        setError('Error registering student: ' + json.error);
      }
    } catch (error) {
      setError('Network error: ' + error.message);
    } finally {
      setLoading(false); // Re-enable button
    }
  };

  return (
    <div className={style.createBox}>
      <form onSubmit={handleSubmit}>
        <h2>Register Student</h2>

        {error && <p className={style.error}>{error}</p>}

        <div className={style.nameBox}>
          <div className={style.info}>
            <label>First name:</label>
            <input type='text' name="first" value={userData.first} onChange={handleOnChange} />
            {formErrors.first && <p className={style.error}>{formErrors.first}</p>}
          </div>
          <div className={style.info}>
            <label>Middle name:</label>
            <input type='text' name="middle" value={userData.middle} onChange={handleOnChange} />
          </div>
          <div className={style.info}>
            <label>Last name:</label>
            <input type='text' name="last" value={userData.last} onChange={handleOnChange} />
            {formErrors.last && <p className={style.error}>{formErrors.last}</p>}
          </div>
        </div>

        <div className={`${style.info} ${style.infoContainer}`}>
          <label>Gender:</label>
          <div>
            <span>
              <input type="radio" name="gender" value="Male" onChange={handleOnChange} checked={userData.gender === 'Male'} />
              Male
            </span>
            <span>
              <input type="radio" name="gender" value="Female" onChange={handleOnChange} checked={userData.gender === 'Female'} />
              Female
            </span>
          </div>
          {formErrors.gender && <p className={style.error}>{formErrors.gender}</p>}
        </div>

        <div className={style.ageGrade}>
          <div className={`${style.info} ${style.infoContainer}`}>
            <label>Age:</label>
            <input type='number' name="age" value={userData.age} onChange={handleOnChange} />
            {formErrors.age && <p className={style.error}>{formErrors.age}</p>}
          </div>
          <div className={`${style.info} ${style.infoContainer}`}>
            <label>Family phone number:</label>
            <input type='tel' name="familyTel" value={userData.familyTel} onChange={handleOnChange} />
            {formErrors.familyTel && <p className={style.error}>{formErrors.familyTel}</p>}
          </div>
        </div>

        <div className={style.adressInfo}>
          <div className={style.info}>
            <label>Region/ State</label>
            <input type='text' name="region" value={userData.region} onChange={handleOnChange} />
            {formErrors.region && <p className={style.error}>{formErrors.region}</p>}
          </div>
          <div className={style.info}>
            <label>City</label>
            <input type='text' name="city" value={userData.city} onChange={handleOnChange} />
            {formErrors.city && <p className={style.error}>{formErrors.city}</p>}
          </div>
          <div className={style.info}>
            <label>Subcity/ Zone</label>
            <input type='text' name="subCity" value={userData.subCity} onChange={handleOnChange} />
            {formErrors.subCity && <p className={style.error}>{formErrors.subCity}</p>}
          </div>
          <div className={style.info}>
            <label>Wereda</label>
            <input type='text' name="wereda" value={userData.wereda} onChange={handleOnChange} />
            {formErrors.wereda && <p className={style.error}>{formErrors.wereda}</p>}
          </div>
          <div className={style.info}>
            <label>House No.</label>
            <input type='text' name="houseNo" value={userData.houseNo} onChange={handleOnChange} />
            {formErrors.houseNo && <p className={style.error}>{formErrors.houseNo}</p>}
          </div>
        </div>

        <button type='submit' className={`${style.button} ${style.submit}`} disabled={loading}>
          {loading ? 'Submitting...' : 'Register'}
        </button>
      </form>
    </div>
  );
}

export default CreateStudent;
