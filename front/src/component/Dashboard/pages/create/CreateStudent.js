import React, { useState } from 'react';
import style from '../css/pages.module.css';
import { useNavigate } from 'react-router-dom';

function CreateStudent({ sectionId }) {
    const [userData, setUserData] = useState({
        first: "", middle: "", last: "", gender: "", age: "", region: "", city: "", subCity: "", wereda: "", houseNo: "", sectionId
    });
    const [studentPhoto,setStudentPhoto] = useState(null)
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // Handle input change and clear errors
    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    // Handle file change
    const handleFileChange = (e) => {
      setStudentPhoto(e.target.files)
    };

    // Validation part
    const validateStudentData = () => {
        const errors = {};
        let isValid = true;

        if (!userData.first.trim()) {
            errors.first = "First name is required";
            isValid = false;
        }
        if (!userData.middle.trim()) {
            errors.middle = "Middle name is required";
            isValid = false;
        }
        if (!userData.last.trim()) {
            errors.last = "Last name is required";
            isValid = false;
        }
        if (!userData.gender) {
            errors.gender = "Gender is required";
            isValid = false;
        }
        if (!userData.age || userData.age <= 0) {
            errors.age = "Age must be a positive number";
            isValid = false;
        }
        if (!studentPhoto) {
            errors.studentPhoto = "Student photo is required";
            isValid = false;
        }
        if (!userData.region.trim()) {
            errors.region = "Region/State is required";
            isValid = false;
        }
        if (!userData.city.trim()) {
            errors.city = "City is required";
            isValid = false;
        }
        if (!userData.subCity.trim()) {
            errors.subCity = "Subcity/Zone is required";
            isValid = false;
        }
        if (!userData.wereda.trim()) {
            errors.wereda = "Wereda is required";
            isValid = false;
        }
        if (!userData.houseNo) {
            errors.houseNo = "House No. is required";
            isValid = false;
        }

        setErrors(errors);
         return isValid;
    };

    // Form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!validateStudentData()) {
            setLoading(false);
            return;
        }

        const data = new FormData();
        data.set('first',userData.first)
        data.set("last",userData.last)
        data.set('middle',userData.middle)
        data.set('gender',userData.gender)
        data.set('age',userData.age)
        data.set('region',userData.region)
        data.set('city',userData.city)
        data.set('subCity',userData.subCity)
        data.set('wereda',userData.wereda)
        data.set('houseNo',userData.houseNo)
        data.set('studentPhoto',studentPhoto[0])
        data.set('sectionId',userData.sectionId)

        try {
            const response = await fetch('http://localhost:4000/member/student', {
                method: 'POST',
                body: data,
            });
            const json = await response.json();
            if (response.ok) {
                navigate(`/main?type=student&studentId=${json._id}`, { replace: true });
            } else {
                setErrors({ form: json.error || 'Failed to create student.' });
            }
        } catch (error) {
            setErrors({ form: 'An error occurred: ' + error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={style.createBox}>
            <form onSubmit={handleSubmit}>
                <h2>Student's information</h2>
                <div className={style.inLineBox}>
                    <div className={style.info}>
                        <label>First name:</label>
                        <input
                            type='text'
                            name="first"
                            value={userData.first}
                            onChange={handleOnChange}
                            required
                        />
                        {errors.first && <span className={style.error}>{errors.first}</span>}
                    </div>
                    <div className={style.info}>
                        <label>Middle name:</label>
                        <input
                            type='text'
                            name="middle"
                            value={userData.middle}
                            onChange={handleOnChange}
                            required
                        />
                        {errors.middle && <span className={style.error}>{errors.middle}</span>}
                    </div>
                    <div className={style.info}>
                        <label>Last name:</label>
                        <input
                            type='text'
                            name="last"
                            value={userData.last}
                            onChange={handleOnChange}
                            required
                        />
                        {errors.last && <span className={style.error}>{errors.last}</span>}
                    </div>
                </div>

                <div className={`${style.info} ${style.infoContainer}`}>
                    <label>Gender:</label>
                    <div>
                        <span>
                            <input type="radio" name="gender" value="Male" checked={userData.gender === "Male"} onChange={handleOnChange} /> Male
                        </span>
                        <span>
                            <input type="radio" name="gender" value="Female" checked={userData.gender === "Female"} onChange={handleOnChange} /> Female
                        </span>
                    </div>
                    {errors.gender && <span className={style.error}>{errors.gender}</span>}
                </div>

                <div className={style.inLineBox}>
                    <div className={style.info}>
                        <label>Age:</label>
                        <input
                            type='number'
                            name="age"
                            value={userData.age}
                            onChange={handleOnChange}
                            min="1"
                            required
                        />
                        {errors.age && <span className={style.error}>{errors.age}</span>}
                    </div>
                    <div className={style.info}>
                        <label>Student Photo:</label>
                        <input
                            type='file'
                            name="studentPhoto"
                            onChange={handleFileChange}
                            required
                        />
                        {errors.studentPhoto && <span className={style.error}>{errors.studentPhoto}</span>}
                    </div>
                </div>

                <div className={style.inLineBox}>
                    <div className={style.info}>
                        <label>Region/State:</label>
                        <input
                            type='text'
                            name="region"
                            value={userData.region}
                            onChange={handleOnChange}
                            required
                        />
                        {errors.region && <span className={style.error}>{errors.region}</span>}
                    </div>
                    <div className={style.info}>
                        <label>City:</label>
                        <input
                            type='text'
                            name="city"
                            value={userData.city}
                            onChange={handleOnChange}
                            required
                        />
                        {errors.city && <span className={style.error}>{errors.city}</span>}
                    </div>
                    <div className={style.info}>
                        <label>Subcity/Zone:</label>
                        <input
                            type='text'
                            name="subCity"
                            value={userData.subCity}
                            onChange={handleOnChange}
                            required
                        />
                        {errors.subCity && <span className={style.error}>{errors.subCity}</span>}
                    </div>
                    <div className={style.info}>
                        <label>Wereda:</label>
                        <input
                            type='text'
                            name="wereda"
                            value={userData.wereda}
                            onChange={handleOnChange}
                            required
                        />
                        {errors.wereda && <span className={style.error}>{errors.wereda}</span>}
                    </div>
                    <div className={style.info}>
                        <label>House No.:</label>
                        <input
                            type='number'
                            name="houseNo"
                            value={userData.houseNo}
                            onChange={handleOnChange}
                            min="1"
                            required
                        />
                        {errors.houseNo && <span className={style.error}>{errors.houseNo}</span>}
                    </div>
                </div>

                {errors.form && <div className={style.error}>{errors.form}</div>}
                <button type="submit" disabled={loading} className={style.button}>
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
            </form>
        </div>
    );
}

export default CreateStudent;
