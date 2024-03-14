import { useDispatch } from 'react-redux'
import { removePopup } from '../../features/navigation/navigationSlice'
import CloseIcon from '../../svg/others/CloseIcon'
import '../../css/components/Messages.css'

export default function Message({ popup, heading, content }) {
  const dispatch = useDispatch()
    
  return (
    <div className='message-popup'>
      <div  className='message-heading'>
        <p>{heading}</p>
        
        <CloseIcon
          className='close-message'
          onClick={() => dispatch(removePopup(popup))}
        />
      </div>

      <p className='message-content'>{content}</p>
    </div>
  )
}