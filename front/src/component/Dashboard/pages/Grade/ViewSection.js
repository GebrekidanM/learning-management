import React, { useEffect, useState } from 'react'
import URL from '../../../UI/URL'
import LoadingIndicator from '../../../common/LoadingIndicator'
import ErrorMessage from '../../../common/ErrorMessage'
import { useLocation } from 'react-router-dom'
import { Button } from 'primereact/button'
import DeleteSection from '../Delete/DeleteSection'
import { toast, ToastContainer } from 'react-toastify'

function ViewSection({gradeId}) {
    const [sections,setSections] = useState([])
    const [error,setError]= useState('')
    const [loading,setLoading]= useState(false)
    const location = useLocation()
    const {grade} = location.state||{}
    const [selectedId,setSelectedId] = useState('')
    const [cardShown,setCardShown] = useState(false)
    const [refresh, setRefresh]=useState(false)
    useEffect(()=>{
        const fetchSections = async()=>{
            try {
                setLoading(true)
                const response = await fetch(`${URL()}/class/sections/${gradeId}`)
                const json = await response.json()

                if(response.ok){
                    setSections(json)
                }else{
                    setError(json.error)
                }
            } catch (error) {
                setError(error.message)
            }finally{
                setLoading(false)
            }
        }
        fetchSections()
    },[gradeId,refresh])

    const handleDelete = (sectionId) =>{
        setSelectedId(sectionId)
        setCardShown(true)
    }

    const handleDeleteSuccess = ()=>{
        toast.success('Section deleted successfully.', {
            onClose: () => {
              // Delay refresh or navigation until after the toast is shown
              setCardShown(false);
              setRefresh((prev) => !prev); // Refresh the data
            },
            autoClose: 3000, 
        })
    }

    if(loading){
        return <LoadingIndicator/>
    }
  return (
    <div className='mt-8 w-8 mx-auto'>
    <ToastContainer/>
        <h3>Sections in Grade {grade}</h3>
        <div className='mt-3 w-full flex flex-column gap-3'>
            {error && <ErrorMessage error={error}/>}
            {sections?.map(section=>(
                <div className='flex gap-3'>
                    <div key={section._id} className={` button w-4 bg-white text-cyan-900 w-full border-cyan-900 border-1 hover:bg-cyan-900 hover:text-white`}> {section.section}</div>
                    <Button 
                            className="p-button p-button-danger p-mr-2" 
                            icon={"pi pi-trash"}
                            onClick={()=>handleDelete(section._id)}
                            />
                </div>
            ))}
        </div>
        {cardShown && <DeleteSection 
                    setDeleteCard={setCardShown}
                    name={sections.find(grade => grade._id === selectedId)?.section}
                    id={selectedId}
                    type="Section"
                    onDeleteSuccess={handleDeleteSuccess}
                />}
    </div>
  )
}

export default ViewSection
