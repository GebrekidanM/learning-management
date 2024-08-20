import React, { useEffect, useState } from 'react';
import style from '../css/Edit.module.css';
import { useNavigate } from 'react-router-dom';
import { LiaUserEditSolid } from "react-icons/lia";

function StudentEdit({ studentId }) {
    const [student, setStudent] = useState({
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
    });
    const [studentPhoto, setStudentPhoto] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
  const [showFileInput, setShowFileInput] = useState(false);

    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudent = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:4000/member/student/only/${studentId}`);
                const data = await response.json();
                if (response.ok) {
                    setStudent({
                        first: data.student.first,
                        middle: data.student.middle,
                        last: data.student.last,
                        gender: data.student.gender,
                        age: data.student.age,
                        region: data.student.region,
                        city: data.student.city,
                        subCity: data.student.subCity,
                        wereda: data.student.wereda,
                        houseNo: data.student.houseNo,
                    });
                    setStudentPhoto(data.student.studentPhoto);
                } else {
                    setError(data.error || 'Failed to fetch student data.');
                }
            } catch (err) {
                setError('An error occurred: ' + err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchStudent();
    }, [studentId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setStudent((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
  

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setStudentPhoto(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append('first', student.first);
        formData.append('middle', student.middle);
        formData.append('last', student.last);
        formData.append('gender', student.gender);
        formData.append('age', student.age);
        formData.append('region', student.region);
        formData.append('city', student.city);
        formData.append('subCity', student.subCity);
        formData.append('wereda', student.wereda);
        formData.append('houseNo', student.houseNo);
        
        if (studentPhoto instanceof File) {
            formData.append('studentPhoto', studentPhoto);
        }

        try {
            const response = await fetch(`http://localhost:4000/member/student/updat/${studentId}`, {
                method: 'PATCH',
                body: formData,
            });
            const data = await response.json();
            if (response.ok) {
                navigate(`/main?type=student&studentId=${studentId}`, { replace: true });
            } else {
                setError(data.error || 'Failed to update student.');
            }
        } catch (err) {
            setError('An error occurred: ' + err.message);
        } finally {
            setLoading(false);
        }
    };
    const handleClick = () => {
        setShowFileInput(!showFileInput);
      };

    return (
        <div className={style.container}>
            {loading ? <p>Loading...</p>:
            <form onSubmit={handleSubmit}>
                {error && <p className='error'>{error}</p>}
                <div className={style.basicInfo}>
                    <span className={style.imageHolder}>
                        <img 
                            src={imagePreview == null ? `http://localhost:4000/uploads/${studentPhoto}` : imagePreview} alt='Profile' />
                            {showFileInput && <input type='file' accept='image/*' onChange={handleFileChange} />}
                            <span className={style.clickEdit} onClick={handleClick}>{<LiaUserEditSolid />}</span>
                    </span>
                    <div  className={style.extraInfo}>      
                        <div className={style.name}>

                            <label htmlFor='first'>First Name:</label>
                            <input
                                type='text'
                                id='first'
                                name='first'
                                value={student.first}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className={style.name}>
                            <label htmlFor='middle'>Middle Name:</label>
                            <input
                                type='text'
                                id='middle'
                                name='middle'
                                value={student.middle}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className={style.name}>
                            <label htmlFor='last'>Last Name:</label>
                            <input
                                type='text'
                                id='last'
                                name='last'
                                value={student.last}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className={style.name}>
                            <label>Gender:</label>
                            <div className={style.genderOptions}>
                                <label>
                                    <input
                                        type='radio'
                                        name='gender'
                                        value='Male'
                                        checked={student.gender === 'Male'}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    Male
                                </label>
                                <label>
                                    <input
                                        type='radio'
                                        name='gender'
                                        value='Female'
                                        checked={student.gender === 'Female'}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    Female
                                </label>
                            </div>
                        </div>
                        <div className={style.name}>
                            <label htmlFor='age'>Age:</label>
                            <input
                                type='number'
                                id='age'
                                name='age'
                                value={student.age}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <button type='submit' disabled={loading} className={`button ${style.button}` }>
                            {loading ? 'Updating...' : 'Update'}
                        </button>
                    </div>
                    <div className={style.extraInfo}>
                        <div className={style.name}>
                            <label htmlFor='region'>Region/State:</label>
                            <input
                                type='text'
                                id='region'
                                name='region'
                                value={student.region}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className={style.name}>
                            <label htmlFor='city'>City:</label>
                            <input
                                type='text'
                                id='city'
                                name='city'
                                value={student.city}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className={style.name}>
                            <label htmlFor='subCity'>Subcity/Zone:</label>
                            <input
                                type='text'
                                id='subCity'
                                name='subCity'
                                value={student.subCity}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className={style.name}>
                            <label htmlFor='wereda'>Wereda:</label>
                            <input
                                type='text'
                                id='wereda'
                                name='wereda'
                                value={student.wereda}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className={style.name}>
                            <label htmlFor='houseNo'>House No.:</label>
                            <input
                                type='number'
                                id='houseNo'
                                name='houseNo'
                                value={student.houseNo}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        
                    </div>
                       
                </div>
            </form>
            }
        </div>
    );
}

export default StudentEdit;
