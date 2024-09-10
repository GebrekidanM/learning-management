import React, { useEffect, useState } from 'react';
import style from '../css/Edit.module.css';
import { useNavigate } from 'react-router-dom';
import { LiaUserEditSolid } from "react-icons/lia";
import ErrorMessage from '../../../common/ErrorMessage';
import LoadingIndicator from '../../../common/LoadingIndicator';
import URL from '../../../UI/URL';

function TeacherEdit({ teacherId }) {
    const [teacher, setTeacher] = useState({
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
        experience:'',
        email:'',
        phoneNo:''
    });
    const [teacherPhoto, setTeacherPhoto] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
  const [showFileInput, setShowFileInput] = useState(false);

    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudent = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${URL()}/teacher/${teacherId}`);
                const data = await response.json();
                if (response.ok) {
                    setTeacher({
                        first: data.first,
                        middle: data.middle,
                        last: data.last,
                        gender: data.gender,
                        age: data.age,
                        region: data.region,
                        city: data.city,
                        subCity: data.subCity,
                        wereda: data.wereda,
                        houseNo: data.houseNo,
                        experience:data.experience,
                        email:data.email,
                        phoneNo:data.phoneNo
                    });
                    setTeacherPhoto(data.teacherPhoto);
                } else {
                    setError(data.error || 'Failed to fetch Teacher data.');
                }
            } catch (err) {
                setError('An error occurred: ' + err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchStudent();
    }, [teacherId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTeacher((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
  

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setTeacherPhoto(file);
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
        formData.append('first', teacher.first);
        formData.append('middle', teacher.middle);
        formData.append('last', teacher.last);
        formData.append('gender', teacher.gender);
        formData.append('age', teacher.age);
        formData.append('region', teacher.region);
        formData.append('city', teacher.city);
        formData.append('subCity', teacher.subCity);
        formData.append('wereda', teacher.wereda);
        formData.append('houseNo', teacher.houseNo);
        
        if (teacherPhoto instanceof File) {
            formData.append('teacherPhoto', teacherPhoto);
        }

        try {
            const response = await fetch(`${URL()}/teacher/update/${teacherId}`, {
                method: 'PATCH',
                body: formData,
            });
            const data = await response.json();
            if (response.ok) {
                navigate(`/main?type=teacher&teacherId=${teacherId}`, { replace: true });
            } else {
                setError(data.error || 'Failed to update teacher.');
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
      if (error) {
        return <ErrorMessage error={error} />;
    }
    if(loading){
        return <LoadingIndicator/>
      }

    return (
        <div className={style.container}>
            <form onSubmit={handleSubmit}>
                <div className={style.basicInfo}>
                    <span className={`TeacherAddressEdit ${style.imageHolder}`}>
                        <img 
                            src={imagePreview == null ? `${URL()}/uploads/${teacherPhoto}` : imagePreview} alt='Profile' />
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
                                value={teacher.first}
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
                                value={teacher.middle}
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
                                value={teacher.last}
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
                                        checked={teacher.gender === 'Male'}
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
                                        checked={teacher.gender === 'Female'}
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
                                value={teacher.age}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className={style.name}>
                            <label htmlFor='email'>Email:</label>
                            <input
                                type='email'
                                id='email'
                                name='email'
                                value={teacher.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className={style.name}>
                            <label htmlFor='experience'>Experience:</label>
                            <input
                                type='number'
                                id='experience'
                                name='experience'
                                value={teacher.experience}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className={style.name}>
                            <label htmlFor='phone'>Phone:</label>
                            <input
                                type='number'
                                id='phone'
                                name='phoneNo'
                                value={teacher.phoneNo}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <button type='submit' disabled={loading} className={`button ${style.button}` }>
                            {loading ? 'Updating...' : 'Update'}
                        </button>
                    </div>
                    <div className={`TeacherAddressEdit ${style.extraInfo}`}>
                        <div className={style.name}>
                            <label htmlFor='region'>Region/State:</label>
                            <input
                                type='text'
                                id='region'
                                name='region'
                                value={teacher.region}
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
                                value={teacher.city}
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
                                value={teacher.subCity}
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
                                value={teacher.wereda}
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
                                value={teacher.houseNo}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default TeacherEdit;