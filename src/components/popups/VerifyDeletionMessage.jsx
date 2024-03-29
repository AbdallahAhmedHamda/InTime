import { useDispatch } from 'react-redux'
import { removeAllPopups, removePopup } from '../../features/navigation/navigationSlice'
import { removeTask } from '../../features/user/userSlice'
import CloseIcon from '../../svg/others/CloseIcon'
import '../../css/components/Messages.css'

export default function VerifyDeletionMessage({ task }) {
  const dispatch = useDispatch()

  const deleteTask = () => {
    dispatch(removeTask({ taskId: task.id, taskTag: task.tag.name}))
    dispatch(removeAllPopups())  
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