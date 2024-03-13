import { useDispatch } from 'react-redux'
import { removePopup } from '../../features/navigation/navigationSlice'
import CloseIcon from '../../svg/others/CloseIcon'
import '../../css/components/TaskPreview.css'

export default function TaskPreview({ currentTask }) {
  const dispatch = useDispatch()

  return (
    <div className='error-message-popup'>
      <div  className='error-message-heading'>
        <p>heading</p>
        
        <CloseIcon
          className='close-error-message'
          onClick={() => dispatch(removePopup('task preview'))}
        />
      </div>

      <p className='error-message-content'>content</p>
    </div>
  )
}