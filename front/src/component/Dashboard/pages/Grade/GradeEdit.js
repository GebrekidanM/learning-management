import React, { useEffect, useState } from 'react'
import URL from '../../../UI/URL'
import LoadingIndicator from '../../../common/LoadingIndicator'
import ErrorMessage from '../../../common/ErrorMessage'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Link } from 'react-router-dom'
import DeleteSection from '../Delete/DeleteSection'

function GradeEdit({semesterId}) {
    const [grades,setGrades] = useState([])
    const [error,setError] = useState('')
    const [loading,setLoading] = useState(false)
    const [deleteCard,setDeleteCard] = useState(false)
    const [selectedGradeId,setSelectedGrade] = useState('')

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
    },[semesterId])

    const handleDeleteCard = (id)=>{
        selectedGradeId(id)
        setDeleteCard(true);
    }

    const handleDeleteSuccess = ()=>{
        setDeleteCard(false)
    }

    if(loading){
        return <LoadingIndicator/>
    }

  return (
    <div>
        {error && <ErrorMessage error={error}/>}

        <DataTable value={grades} className="mt-4" paginator rows={10} responsiveLayout="scroll">
        <Column field="grade" header="Grade" sortable />
        <Column className='flex gap-3' header="Action" body={(data) => (
            <>
                <Button 
                    className="p-button p-button-danger p-mr-2"
                    icon="pi pi-trash" 
                    onClick={() => handleDeleteCard(data._id)}/>
                <Link to={`/main?type=grade&action=${data._id}`}>
                    <Button className="p-button p-button-secondary p-mr-2">Edit</Button>
                </Link>
                <Link to={`/main?type=grade&gradeId=${data._id}`}>
                    <Button className="p-button p-button-info">View</Button>
                </Link>
            </>
        )} />
      </DataTable>
      {deleteCard && <DeleteSection 
                    setDeleteCard={setDeleteCard}
                    name={grades.find(student => student._id === selectedGradeId)?.first}
                    id={selectedGradeId}
                    onDeleteSuccess={handleDeleteSuccess}
                />}
      
    </div>
  )
}

export default GradeEdit
