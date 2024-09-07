import { Card } from 'primereact/card'
import React,{useState} from 'react'
import URL from '../../../UI/URL';

function DeleteSection({name,onDeleteSuccess,setDeleteCard,id,type}) {
  const [isDisabled, setIsDisabled] = useState(false);

  const handleDelete = async () => {
    setIsDisabled(true)
    try {
        const response = await fetch(`${URL()}/class/grade/delete/${id}`, {
            method: "DELETE"
        });
        if (response.ok) {
            onDeleteSuccess();
        } else {
            alert('Failed to delete. Please try again.');
        }
    } catch (error) {
        alert('An error occurred. Please try again.');
    }
    setTimeout(() => {
      setIsDisabled(false);
    }, 4000);
};

const handleSectionDelete = async () => {
  setIsDisabled(true)
  try {
      const response = await fetch(`${URL()}/class/section/delete/${id}`, {
          method: "DELETE"
      });
      if (response.ok) {
          onDeleteSuccess();
      } else {
          alert('Failed to delete. Please try again.');
      }
  } catch (error) {
      alert('An error occurred. Please try again.');
  }
  setTimeout(() => {
    setIsDisabled(false);
  }, 4000);
};

  const handleGoBack = () => {
      setDeleteCard(false);
  };

  return (
    <div 
        className='absolute top-0 left-0 w-full h-full bg-black-alpha-90 opacity-1  overflow-y-hidden flex justify-content-center align-items-center'
        >
        <Card className='w-4 bg-cyan-900 text-white text-center'>
            <h2>{type} {type === 'Grade' && name}</h2>
            <p>Do you want to <span className='text-yellow-500'>Delete</span> this {type}?</p>
            <div className='w-8 mx-auto flex justify-content-between'>
              <button className={`button ${isDisabled ? 'bg-cyan-700 cursor-wait' : 'bg-yellow-700'} hover:bg-cyan-700`} disabled={isDisabled} onClick={type==='Grade' ? handleDelete : handleSectionDelete}>Delete</button>
              <button className={`button ${isDisabled ? 'bg-cyan-700 cursor-wait' : 'bg-yellow-700'} hover:bg-cyan-700`} disabled={isDisabled} onClick={handleGoBack}>Cancel</button>
            </div>
        </Card>
    </div>
  )
}

export default DeleteSection