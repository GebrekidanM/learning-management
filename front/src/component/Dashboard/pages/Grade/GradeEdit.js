import React, { useEffect, useState } from 'react'
import URL from '../../../UI/URL'
import LoadingIndicator from '../../../common/LoadingIndicator'
import ErrorMessage from '../../../common/ErrorMessage'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Link } from 'react-router-dom'
import DeleteSection from '../Delete/DeleteSection'
import { ToastContainer,toast } from 'react-toastify';


function GradeEdit({semesterId}) {
    const [grades,setGrades] = useState([])
    const [error,setError] = useState('')
    const [loading,setLoading] = useState(false)
    const [deleteCard,setDeleteCard] = useState(false)
    const [selectedGradeId,setSelectedGrade] = useState('')
    const [refresh,setRefresh] = useState(false)

    useEffect(()=>{
        
        const fetchGrades = async()=>{
            try {
                setLoading(true)
                const response = await fetch(`${URL()}/class/grades/${semesterId}`)
                const json = await response.json()
                if(response.ok){
                    setGrades(json)
                }else{
                    setError(json.error)
                }
            } catch (error) {
                setError(error.massege)
            }finally{
                setLoading(false)
            }
        } 
        
        fetchGrades()
    },[semesterId,refresh])

    const handleDeleteCard = (id)=>{
        setSelectedGrade(id)
        setDeleteCard(true);
    }

    const handleDeleteSuccess = ()=>{
        toast.success('Grade deleted successfully.', {
            onClose: () => {
              // Delay refresh or navigation until after the toast is shown
              setDeleteCard(false);
              setRefresh((prev) => !prev); // Refresh the data
            },
            autoClose: 3000, 
        })
    }

    if(loading){
        return <LoadingIndicator/>
    }

  return (
    <div>
        <ToastContainer/>

        {error && <ErrorMessage error={error}/>}

        <DataTable value={grades} className="mt-4" paginator rows={10} responsiveLayout="scroll">
        <Column field="grade" header="Grade" sortable />
        <Column className='flex gap-3' header="Action" body={(data) => (
            <>
                <Button 
                    className="p-button p-button-danger p-mr-2"
                    icon="pi pi-trash" 
                    onClick={() => handleDeleteCard(data._id)}/>
                <Link to={{
                            pathname: `/main`,
                            search: `?type=grade&gradeViewId=${data._id}`,
                            }}
                          state={{ grade: data.grade }}>

                    <Button className="p-button p-button-info">View Sections</Button>
                </Link>
            </>
        )} />
      </DataTable>
      {deleteCard && <DeleteSection 
                    setDeleteCard={setDeleteCard}
                    name={grades.find(grade => grade._id === selectedGradeId)?.grade}
                    id={selectedGradeId}
                    type="Grade"
                    onDeleteSuccess={handleDeleteSuccess}
                />}
      
    </div>
  )
}

export default GradeEdit
