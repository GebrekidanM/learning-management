import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import URL from '../../../UI/URL';
import ErrorMessage from '../../../common/ErrorMessage';



function CreateStudent({ sectionId }) {
    const location = useLocation()
    const {yearName}=location.state || {}
    const [userData, setUserData] = useState({
        first: "", middle: "", last: "", gender: "", age: "", region: "", city: "", subCity: "", wereda: "", houseNo: "", sectionId,yearName
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
        data.set('yearName',userData.yearName)

        try {
            const response = await fetch(`${URL()}/student`, {
                method: 'POST',
                body: data,
                credentials:'include'
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
        <div className={`mt-3`}>
            <form onSubmit={handleSubmit} className='mb-8' >
                <div className=' lg:grid grid-cols-4 gap-4 grid-auto-rows '>
                    <h2 className='font-bold text-2xl h-auto col-span-4 text-center'>Student's information</h2>
                    <div className={'flex flex-col gap-3 col-span-2 row-start-2 row-end-3'}>
                        <div className={' flex flex-col gap-2'}>
                            <label>First name:</label>
                            <input
                                type='text'
                                name="first"
                                value={userData.first}
                                onChange={handleOnChange}
                                className='max-w-96'
                                required
                            />
                            {errors.first && <ErrorMessage error={errors.first}/>}
                        </div>
                        <div className={' flex flex-col gap-2'}>
                            <label>Middle name:</label>
                            <input
                                type='text'
                                name="middle"
                                value={userData.middle}
                                onChange={handleOnChange}
                                className='max-w-96'

                                required
                            />
                            {errors.middle && <ErrorMessage error={errors.middle}/>}
                        </div>
                        <div className={' flex flex-col gap-2'}>
                            <label>Last name:</label>
                            <input
                                type='text'
                                name="last"
                                value={userData.last}
                                onChange={handleOnChange}
                                className='max-w-96'

                                required
                            />
                            {errors.last && <ErrorMessage error={errors.last}/>}
                        </div>         
                        <div className={' flex flex-col gap-2'}>
                            <label>Age:</label>
                            <input
                                className='max-w-96'
                                type='number'
                                name="age"
                                value={userData.age}
                                onChange={handleOnChange}
                                min="1"
                                required
                            />
                            {errors.age && <ErrorMessage error={errors.age}/>}
                        </div>
                        <div className={'flex flex-col gap-2'}>
                            <label>Gender:</label>
                            <div className='flex gap-3'>
                                <span>
                                    <input type="radio" name="gender" value="Male" checked={userData.gender === "Male"} onChange={handleOnChange} /> Male
                                </span>
                                <span>
                                    <input type="radio" name="gender" value="Female" checked={userData.gender === "Female"} onChange={handleOnChange} /> Female
                                </span>
                            </div>
                            {errors.gender && <ErrorMessage error={errors.gender}/>}
                        </div>
                        <div className={' flex flex-col gap-2'}>
                            <label>Student Photo:</label>
                            <input
                                className='max-w-96'
                                type='file'
                                name="studentPhoto"
                                onChange={handleFileChange}
                                required
                            />
                            {errors.studentPhoto && <ErrorMessage error={errors.studentPhoto}/>}
                        </div>
                    </div>
                    <div className={'flex flex-col gap-3 col-span-2 row-start-2 row-end-3'}>
                        
                        <div className={' flex flex-col gap-2'}>
                            <label>Region/State:</label>
                            <input
                                className='max-w-96'
                                type='text'
                                name="region"
                                value={userData.region}
                                onChange={handleOnChange}
                                required
                            />
                            {errors.region && <ErrorMessage error={errors.region}/>}
                        </div>
                        <div className={' flex flex-col gap-2'}>
                            <label>City:</label>
                            <input
                                type='text'
                                className='max-w-96'
                                name="city"
                                value={userData.city}
                                onChange={handleOnChange}
                                required
                            />
                            {errors.city && <ErrorMessage error={errors.city}/>}
                        </div>
                        <div className={' flex flex-col gap-2'}>
                            <label>Subcity/Zone:</label>
                            <input
                                type='text'
                                className='max-w-96'
                                name="subCity"
                                value={userData.subCity}
                                onChange={handleOnChange}
                                required
                            />
                            {errors.subCity && <ErrorMessage error={errors.subCity}/>}
                        </div>
                        <div className={' flex flex-col gap-2'}>
                            <label>Wereda:</label>
                            <input
                                type='text'
                                className='max-w-96'
                                name="wereda"
                                value={userData.wereda}
                                onChange={handleOnChange}
                                required
                            />
                            {errors.wereda && <ErrorMessage error={errors.wereda}/>}
                        </div>
                        <div className={' flex flex-col gap-2'}>
                            <label>House No.:</label>
                            <input
                                type='number'
                                className='max-w-96'
                                name="houseNo"
                                value={userData.houseNo}
                                onChange={handleOnChange}
                                min="1"
                                required
                            />
                            {errors.houseNo && <ErrorMessage error={errors.houseNo}/>}
                        </div>
                    </div>
                    {errors.form && <ErrorMessage error={errors.form}/>}
                    <button type="submit" disabled={loading} className={'col-start-2 row-start-3 button border mt-3 max-w-96 border-cyan-950 text-yellow-700 bg-white hover:bg-cyan-900'}>
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateStudent;
