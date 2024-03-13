import { useDispatch } from 'react-redux'
import { removePopup } from '../../features/navigation/navigationSlice'
import { finishTask } from '../../features/tasks/tasksSlice'
import CloseIcon from '../../svg/others/CloseIcon'
import '../../css/components/Messages.css'

export default function VerifyCompletionMessage({ task }) {
  const dispatch = useDispatch()

  const completeTask = () => {
    dispatch(finishTask(task.id))
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