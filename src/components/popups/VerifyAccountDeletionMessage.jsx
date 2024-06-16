import { useDispatch } from 'react-redux'
import { removePopup, setIsAuthenticated } from '../../features/navigation/navigationSlice'
import { useEffect } from 'react'
import { deleteAccountApi } from '../../apis/userApi'
import useApi from '../../hooks/useApi'
import CloseIcon from '../../svg/others/CloseIcon'
import '../../css/components/Messages.css'

export default function VerifyAccountDeletionMessage() {

  const dispatch = useDispatch()

  const {
		fetchApi : fetchDeleteAccountApi,
		apiData: deleteAccountApiData,
		apiError: deleteAccountApiError,
		apiLoading: deleteAccountApiLoading
	} = useApi(deleteAccountApi)

  // navigate to sign in on success
	useEffect(() => {
    if (deleteAccountApiData?.success) {
      dispatch(removePopup('verify account deletion'))

      setTimeout(() => {
        dispatch(setIsAuthenticated(false))
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('accessToken')
      }, 300)

      // return () => clearTimeout(timeoutId)
		}
  }, [deleteAccountApiData, dispatch])

  const deleteAccount = () => {
    fetchDeleteAccountApi()
  }

  if (deleteAccountApiError) {
    console.log(deleteAccountApiError)
  }
    
  return (
    <div className='message-popup'>
      <div  className='message-heading'>
        <p>Delete Account</p>
        
        <CloseIcon
          className='close-message'
          onClick={() => dispatch(removePopup('verify account deletion'))}
        />
      </div>

      <p className='message-content'>Are you sure you want to Delete this account?</p>

      <div className='message-button-container'>
        <button className='message-verify-button red' onClick={deleteAccount} disabled={deleteAccountApiLoading}>
          YES
        </button>

        <button 
          className='message-cancel-button'
          onClick={() => dispatch(removePopup('verify accout deletion'))}
        >
          NO
        </button>
      </div>
    </div>
  )
}