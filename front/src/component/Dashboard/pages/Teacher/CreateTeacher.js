import React, { useEffect, useState } from 'react';
import style from '../css/pages.module.css';
import { useNavigate } from 'react-router-dom';
import LoadingIndicator from '../../../common/LoadingIndicator';
import URL from '../../../UI/URL';
import ErrorMessage from '../../../common/ErrorMessage';
function CreateTeacher({yearId,yearName}) {
    const [userData, setUserData] = useState({
        first: "",
        middle: "",
        last: "",
        gender: "",
        age: "",
        region: "",
        city: "",
        subCity: "",
        wereda: "",
        houseNo: "",
        experience:"",
        phoneNo:"",
        email:"",
        yearId,
        yearName
    });
    const [teacherPhoto,setTeacherPhoto] = useState(null)

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();


    useEffect(()=>{

    },[yearId])

    // Handle input change and clear errors
    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    // Handle file change
    const handleFileChange = (e) => {
      setTeacherPhoto(e.target.files)
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
        if (!teacherPhoto) {
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
        if (!userData.phoneNo) {
            errors.phoneNo = "House No. is required";
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
        data.set('email',userData.email)
        data.set('experience',userData.experience)

        data.set('region',userData.region)
        data.set('city',userData.city)
        data.set('subCity',userData.subCity)
        data.set('wereda',userData.wereda)
        data.set('houseNo',userData.houseNo)
        data.set('phoneNo',userData.phoneNo)
        data.set('teacherPhoto',teacherPhoto[0])
        data.set('yearId',userData.yearId)
        data.set('yearName',userData.yearName)


        try {
            const response = await fetch(`${URL()}/teacher`, {
                method: 'POST',
                body: data,
                credentials: 'include' 
            });
            const json = await response.json();
            if (response.ok) {
                navigate(`/main?type=teacher&teacherId=${json._id}`, { replace: true });
            } else {
                setErrors({ form: json.error || 'Failed to create techer.' });
            }
        } catch (error) {
            setErrors({ form: 'An error occurred: ' + error.message });
        } finally {
            setLoading(false);
        }
    };

    if(loading){
        return <LoadingIndicator/>
      }

    return (
        <form onSubmit={handleSubmit} className='w-full flex flex-col gap-4 justify-center'>
            <h2 className='text-center text-lg font-bold my-3 text-cyan-900'>Teacher's information</h2>
            {errors.form && <ErrorMessage error={errors.form}/>}
            <div className='flex justify-center gap-8 w-3/4 mx-auto'>
                <div className={style.inLineBox}>
                    <div className='flex flex-col gap-2'>
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
                    <div className='flex flex-col gap-2'>
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
                    <div className='flex flex-col gap-2'>
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
                    <div className='flex flex-col gap-2'>
                        <label>Gender:</label>
                        <div className='flex gap-4'>
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
                        <div className='flex flex-col gap-2'>
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
                        <div className='flex flex-col gap-2'>
                            <label>Phone Number:</label>
                            <input
                                type='number'
                                name="phoneNo"
                                value={userData.phoneNo}
                                onChange={handleOnChange}
                                min="1"
                                required
                            />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label>Email:</label>
                            <input type='email' 
                                name='email' 
                                value={userData.email} 
                                onChange={handleOnChange}/>
                        </div>
                    </div>
                    </div>
                    <div>
                        <div className='flex flex-col gap-2'>
                            <div className={style.inLineBox}>
                                <div className='flex flex-col gap-2'>
                                    <label>Experience:</label>
                                    <input type='number' 
                                        name='experience' 
                                        value={userData.experience} 
                                        onChange={handleOnChange}/>
                                </div>
                            </div>
                            <div className='flex flex-col gap-2'>
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
                            <div className='flex flex-col gap-2'>
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
                            <div className='flex flex-col gap-2'>
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
                            
                            <div className='flex flex-col gap-2'>
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
                            <div className='flex flex-col gap-2'>
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
                        <div className='flex flex-col gap-2'>
                                <label>Photo:</label>
                                <input
                                    type='file'
                                    name="teacherPhoto"
                                    onChange={handleFileChange}
                                    required
                                />
                                {errors.studentPhoto && <span className={style.error}>{errors.studentPhoto}</span>}
                            </div>
                    </div>   
                </div> 
                <button type="submit" disabled={loading} className='button w-1/2 mx-auto mb-8'>
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
            </form>

    );
}

export default CreateTeacher;
