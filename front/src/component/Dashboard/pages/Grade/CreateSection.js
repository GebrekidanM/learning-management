import React,{useState} from 'react'
import { MultiSelect } from 'primereact/multiselect';
import URL from '../../../UI/URL'; 
import { useNavigate } from 'react-router-dom';
import ErrorMessage from '../../../common/ErrorMessage';
import { Card } from 'primereact/card';
function CreateSection({gradeId}) {
    const [section, setSection] = useState('');
    const [error,setError] = useState('')
    const [loading,setLoading] = useState(false)
    const navigate = useNavigate()
    // Options array with English alphabet letters
    const alphabetOptions = [
      { label: 'A', value: 'A' },
      { label: 'B', value: 'B' },
      { label: 'C', value: 'C' },
      { label: 'D', value: 'D' },
      { label: 'E', value: 'E' },
      { label: 'F', value: 'F' },
      { label: 'G', value: 'G' },
      { label: 'H', value: 'H' },
      { label: 'I', value: 'I' },
      { label: 'J', value: 'J' },
      { label: 'K', value: 'K' },
      { label: 'L', value: 'L' },
      { label: 'M', value: 'M' },
      { label: 'N', value: 'N' },
      { label: 'O', value: 'O' },
      { label: 'P', value: 'P' },
      { label: 'Q', value: 'Q' },
      { label: 'R', value: 'R' },
      { label: 'S', value: 'S' },
      { label: 'T', value: 'T' },
      { label: 'U', value: 'U' },
      { label: 'V', value: 'V' },
      { label: 'W', value: 'W' },
      { label: 'X', value: 'X' },
      { label: 'Y', value: 'Y' },
      { label: 'Z', value: 'Z' },
    ];
  
    const handleSelectChange = (e) => {
      setSection(e.value);
    };
    

  const handleSubmit = async(e)=>{
    e.preventDefault()
    try {
        setLoading(true)
        const response = await fetch(`${URL()}/class/create/sections`,{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({section,gradeId})
        })
        const json = await response.json()
        if(response.ok){
            navigate('/main?type=grade')
        }else{
            setError(json.error)
        }
    } catch (error) {
        setError(error.message)
        
    }finally{
        setLoading(false)
    }
  }


    return (
      <Card className="w-4 mt-7 mx-auto bg-cyan-900 flex flex-column justify-content-center">
        <h2 className='text-white -mt-3'>Select Section</h2>
        <form onSubmit={handleSubmit} className=''>
            {error && <ErrorMessage error={error}/>}
             <MultiSelect
                value={section}
                options={alphabetOptions}
                onChange={handleSelectChange}
                placeholder="Select letters"
                display="chip" // Displays selected items as chips
                className="p-inputtext p-component w-full mt-2"
            />
            <button className={`button hover:bg-cyan-900 ${loading ? 'bg-cyan-900 cursor-wait' : 'bg-yellow-700'} mt-3 w-full`} type='submit'>
                {`${loading ? 'Creating' : 'Create' }`}
            </button>
        </form>
       
      </Card>
    );
}

export default CreateSection
