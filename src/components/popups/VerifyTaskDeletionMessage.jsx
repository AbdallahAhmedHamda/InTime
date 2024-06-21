import { useDispatch } from 'react-redux'
import { incrementRenderCount, removeAllPopups, removePopup } from '../../features/navigation/navigationSlice'
import { useEffect } from 'react'
import { deleteTaskApi } from '../../apis/tasksApi'
import useApi from '../../hooks/useApi'
import CloseIcon from '../../svg/others/CloseIcon'
import '../../css/components/Messages.css'

export default function VerifyTaskDeletionMessage({ task }) {
  const dispatch = useDispatch()

  const {
		fetchApi : fetchDeleteTaskApi,
		apiData: deleteTaskApiData,
		apiError: deleteTaskApiError,
		apiLoading: deleteTaskApiLoading
	} = useApi(deleteTaskApi)

  // close popups on complete
  useEffect(() => {
    if (deleteTaskApiData) {
      dispatch(removeAllPopups())

      dispatch(incrementRenderCount())

    }
  }, [deleteTaskApiData, dispatch])

  const deleteTask = async() => {
    await fetchDeleteTaskApi(task._id)
  }

  if (deleteTaskApiError) {
    console.log(deleteTaskApiError)
  }
  
  return (
    <div className='message-popup'>
      <div  className='message-heading'>
        <p>Delete Task</p>
        
        <CloseIcon
          className='close-message'
          onClick={() => dispatch(removePopup('verify task deletion'))}
        />
      </div>

      <p className='message-content'>Are you sure you want to Delete this task?</p>

      <div className='message-button-container'>
        <button className='message-verify-button red' onClick={deleteTask}  disabled={deleteTaskApiLoading}>
          YES
        </button>

        <button 
          className='message-cancel-button'
          onClick={() => dispatch(removePopup('verify task deletion'))}
        >
          NO
        </button>
      </div>
    </div>
  )
}