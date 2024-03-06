import { useDispatch, useSelector } from 'react-redux'
import { removePopup, setVerifyData } from '../../features/navigation/navigationSlice'
import { finishTask } from '../../features/tasks/tasksSlice'
import { useEffect } from 'react'
import CloseIcon from '../../svg/others/CloseIcon'
import '../../css/components/Messages.css'

export default function VerifyCompletionMessage() {
  const taskId = useSelector((state) => state.navigation.verifyData)

  const dispatch = useDispatch()

  // remove saved data from redux when popup unmounts
  useEffect(() => {
    return () => {
      dispatch(setVerifyData(''))
    }
    // eslint-disable-next-line
  }, [])

  const completeTask = () => {
    dispatch(finishTask(taskId))
    dispatch(removePopup('verify task completion'))    
  }
    
  return (
    <div className='error-message-popup'>
      <div  className='error-message-heading'>
        <p>Complete Task</p>
        
        <CloseIcon
          className='close-error-message'
          onClick={() => dispatch(removePopup('verify task completion'))}
        />
      </div>

      <p className='error-message-content'>Are you sure you want to mark this task as completed?</p>

      <div className='message-button-container'>
        <button className='message-verify-button blue' onClick={completeTask}>
          YES
        </button>

        <button 
          className='message-cancel-button'
          onClick={() => dispatch(removePopup('verify task completion'))}
        >
          No
        </button>
      </div>
    </div>
  )
}