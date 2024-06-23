import { useDispatch } from 'react-redux'
import { setActionDone, removeAllPopups, removePopup } from '../../features/navigation/navigationSlice'
import { useEffect } from 'react'
import { deleteProjectMemberApi } from '../../apis/projectsApi'
import useApi from '../../hooks/useApi'
import CloseIcon from '../../svg/others/CloseIcon'
import '../../css/components/Messages.css'

export default function VerifyProjectDeletionMessage({ currentProject, currentMember }) {
  const dispatch = useDispatch()

  const {
		fetchApi : fetchDeleteProjectMemberApi,
		apiData: deleteProjectMemberApiData,
		apiError: deleteProjectMemberApiError,
		apiLoading: deleteProjectMemberApiLoading
	} = useApi(deleteProjectMemberApi)

  // close popups on complete
  useEffect(() => {
    if (deleteProjectMemberApiData) {
      dispatch(removeAllPopups())

      dispatch(setActionDone('remove member'))

    }
  }, [deleteProjectMemberApiData, dispatch])

  const removeMember = async() => {
    await fetchDeleteProjectMemberApi(currentProject._id, currentMember._id)

  }

  if (deleteProjectMemberApiError) {
    console.log(deleteProjectMemberApiError)
  }
  
  return (
    <div className='message-popup'>
      <div  className='message-heading'>
        <p>Remove Member</p>
        
        <CloseIcon
          className='close-message'
          onClick={() => dispatch(removePopup('confirm member removal'))}
        />
      </div>

      <p className='message-content'>Are you sure you want to remove {currentMember.name} from {currentProject.name}</p>

      <div className='message-button-container'>
        <button className='message-verify-button red' onClick={removeMember}  disabled={deleteProjectMemberApiLoading}>
          YES
        </button>

        <button 
          className='message-cancel-button'
          onClick={() => dispatch(removePopup('confirm member removal'))}
        >
          NO
        </button>
      </div>
    </div>
  )
}