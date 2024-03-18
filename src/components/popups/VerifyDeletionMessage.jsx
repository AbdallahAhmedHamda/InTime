import { useDispatch } from 'react-redux'
import { removeAllPopups, removePopup } from '../../features/navigation/navigationSlice'
import { removeTask } from '../../features/tasks/tasksSlice'
import { removeTaskId } from '../../features/user/userSlice'
import CloseIcon from '../../svg/others/CloseIcon'
import '../../css/components/Messages.css'

export default function VerifyDeletionMessage({ task }) {
  const dispatch = useDispatch()

  const deleteTask = () => {
    dispatch(removeTask(task.id))
    dispatch(removeAllPopups())  
    dispatch(removeTaskId({
      taskId: task.id,
      isCompleted: task.isCompleted,
      backlog: task.backlog
    }))
  }
    
  return (
    <div className='message-popup'>
      <div  className='message-heading'>
        <p>Delete Task</p>
        
        <CloseIcon
          className='close-message'
          onClick={() => dispatch(removePopup('verify task completion'))}
        />
      </div>

      <p className='message-content'>Are you sure you want to Delete this task?</p>

      <div className='message-button-container'>
        <button className='message-verify-button red' onClick={deleteTask}>
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