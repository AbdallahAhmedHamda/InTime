import { useDispatch } from 'react-redux'
import { removePopup } from '../../features/navigation/navigationSlice'
import '../../css/components/Message.css'
import CloseIcon from '../../svg/others/CloseIcon'

export default function Message({ popup, heading, content }) {
  const dispatch = useDispatch()
    
  return (
    <div className='error-message-popup'>
      <div  className='error-message-heading'>
        <p>{heading}</p>
        
        <CloseIcon
          className='close-error-message'
          onClick={() => dispatch(removePopup(popup))}
        />
      </div>

      <p className='error-message-content'>{content}</p>
    </div>
  )
}