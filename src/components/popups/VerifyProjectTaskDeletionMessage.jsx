import { useDispatch } from 'react-redux'
import { setActionDone, removeAllPopups, removePopup } from '../../features/navigation/navigationSlice'
import { useEffect } from 'react'
import { deleteProjectTaskApi } from '../../apis/projectsApi'
import useApi from '../../hooks/useApi'
import CloseIcon from '../../svg/others/CloseIcon'
import '../../css/components/Messages.css'

export default function VerifyProjectTaskDeletionMessage({ currentProject, currentTask }) {
  const dispatch = useDispatch()

  const {
		fetchApi : fetchDeleteProjectTaskApi,
		apiData: deleteProjectTaskApiData,
		apiError: deleteProjectTaskApiError,
		apiLoading: deleteProjectTaskApiLoading
	} = useApi(deleteProjectTaskApi)

  // close popups on complete
  useEffect(() => {
    if (deleteProjectTaskApiData) {
      dispatch(removeAllPopups())

      dispatch(setActionDone('remove project task'))

    }
  }, [deleteProjectTaskApiData, dispatch])

  const deleteTask = async() => {
    await fetchDeleteProjectTaskApi(currentProject._id, currentTask._id)
  }

  if (deleteProjectTaskApiError) {
    console.log(deleteProjectTaskApiError)
  }
  
  return (
    <div className='message-popup'>
      <div  className='message-heading'>
        <p>Delete Project Task</p>
        
        <CloseIcon
          className='close-message'
          onClick={() => dispatch(removePopup('verify project task deletion'))}
        />
      </div>

      <p className='message-content'>Are you sure you want to Delete this project task?</p>

      <div className='message-button-container'>
        <button className='message-verify-button red' onClick={deleteTask}  disabled={deleteProjectTaskApiLoading}>
          YES
        </button>

        <button 
          className='message-cancel-button'
          onClick={() => dispatch(removePopup('verify project task deletion'))}
        >
          NO
        </button>
      </div>
    </div>
  )
}