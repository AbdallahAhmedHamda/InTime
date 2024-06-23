import { useDispatch } from 'react-redux'
import { setActionDone, removeAllPopups, removePopup } from '../../features/navigation/navigationSlice'
import { useEffect, useState } from 'react'
import { completeTaskApi } from '../../apis/tasksApi'
import { rankApi } from '../../apis/userApi'
import useApi from '../../hooks/useApi'
import CloseIcon from '../../svg/others/CloseIcon'
import '../../css/components/Messages.css'

export default function VerifyTaskCompletionMessage({ task }) {
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)

  const {
		fetchApi : fetchCompleteTaskApi,
		apiError: completeTaskApiError,
    apiLoading: completeTaskApiLoading

	} = useApi(completeTaskApi)

  const {
		fetchApi : fetchRankApi,
		apiData: rankApiData,
		apiError: rankApiError,
		apiLoading: rankApiLoading
	} = useApi(rankApi)

  // close popups on complete
  useEffect(() => {    
    if (rankApiData) {
      dispatch(removeAllPopups())

      dispatch(setActionDone('complete task'))

    }
  }, [rankApiData, dispatch])

  // remove the loading state when the api finish loading
  useEffect(() => {    
    if (rankApiLoading && completeTaskApiLoading) {
      setLoading(false)
    }
  }, [rankApiLoading, completeTaskApiLoading])

  const completeTask = async() => {
    setLoading(true)

    await fetchCompleteTaskApi((task._id))

    await fetchRankApi()
  }

  if (completeTaskApiError) {
    console.log(completeTaskApiError)
  }

  if (rankApiError) {
    console.log(rankApiError)
  }
    
  return (
    <div className='message-popup'>
      <div  className='message-heading'>
        <p>Complete Task</p>
        
        <CloseIcon
          className='close-message'
          onClick={() => dispatch(removePopup('verify task completion'))}
        />
      </div>

      <p className='message-content'>Are you sure you want to mark this task as completed?</p>

      <div className='message-button-container'>
        <button className='message-verify-button blue' onClick={completeTask} disabled={loading}>
          YES
        </button>

        <button 
          className='message-cancel-button'
          onClick={() => dispatch(removePopup('verify task completion'))}
        >
          NO
        </button>
      </div>
    </div>
  )
}