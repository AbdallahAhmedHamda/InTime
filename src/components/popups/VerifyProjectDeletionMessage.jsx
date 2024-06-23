import { useDispatch } from 'react-redux'
import { setActionDone, removeAllPopups, removePopup } from '../../features/navigation/navigationSlice'
import { useEffect } from 'react'
import { deleteProjectApi } from '../../apis/projectsApi'
import useApi from '../../hooks/useApi'
import CloseIcon from '../../svg/others/CloseIcon'
import '../../css/components/Messages.css'

export default function VerifyProjectDeletionMessage({ project }) {
  const dispatch = useDispatch()

  const {
		fetchApi : fetchDeleteProjectApi,
		apiData: deleteProjectApiData,
		apiError: deleteProjectApiError,
		apiLoading: deleteProjectApiLoading
	} = useApi(deleteProjectApi)

  // close popups on complete
  useEffect(() => {
    if (deleteProjectApiData) {
      dispatch(removeAllPopups())

      dispatch(setActionDone('remove project'))

    }
  }, [deleteProjectApiData, dispatch])

  const deleteProject = async() => {
    await fetchDeleteProjectApi((project._id))
  }

  if (deleteProjectApiError) {
    console.log(deleteProjectApiError)
  }
  
  return (
    <div className='message-popup'>
      <div  className='message-heading'>
        <p>Delete Project</p>
        
        <CloseIcon
          className='close-message'
          onClick={() => dispatch(removePopup('verify project deletion'))}
        />
      </div>

      <p className='message-content'>Are you sure you want to Delete this project?</p>

      <div className='message-button-container'>
        <button className='message-verify-button red' onClick={deleteProject}  disabled={deleteProjectApiLoading}>
          YES
        </button>

        <button 
          className='message-cancel-button'
          onClick={() => dispatch(removePopup('verify project deletion'))}
        >
          NO
        </button>
      </div>
    </div>
  )
}