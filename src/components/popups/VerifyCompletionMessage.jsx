import { useDispatch } from 'react-redux'
import { removeAllPopups, removePopup } from '../../features/navigation/navigationSlice'
import { finishTask } from '../../features/tasks/tasksSlice'
import CloseIcon from '../../svg/others/CloseIcon'
import '../../css/components/Messages.css'
import { addPoints } from '../../features/user/userSlice'

export default function VerifyCompletionMessage({ task }) {
  const dispatch = useDispatch()

  const completeTask = () => {
    dispatch(finishTask(task.id))
    dispatch(addPoints(20))
    dispatch(removeAllPopups())  
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
        <button className='message-verify-button blue' onClick={completeTask}>
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