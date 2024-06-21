import { useDispatch } from 'react-redux'
import { removePopup } from '../../features/navigation/navigationSlice'
import { useRef } from 'react'
import CloseIcon from '../../svg/others/CloseIcon'
import CopyIcon from '../../svg/projects/CopyIcon'
import '../../css/components/Messages.css'

export default function InviteLink({ currentInviteLink }) {
  const dispatch = useDispatch()

  const inputRef = useRef(null)

  const copyToClipboard = async () => {
    if (inputRef.current) {
      try {
        await navigator.clipboard.writeText(inputRef.current.value)
      } catch (err) {
        console.error('Failed to copy: ', err)
      }
    }
  }
  
  return (
    <div
      className='message-popup ' 
    >
      <div  className='message-heading'>
        <p>Project Link</p>
        
        <CloseIcon
          className='close-message'
          onClick={() => dispatch(removePopup('invite link'))}
        />
      </div>

      <div className='invite-link-input-block'>
        <input
          readOnly
          spellCheck='false'
          autoComplete='off'
          className='invite-link-input'
          type='text'
          ref={inputRef}
          name='inviteLink'
          id='inviteLink'
          value={currentInviteLink}
        />

        <CopyIcon copyToClipboard={copyToClipboard} />
      </div>
    </div>
  )
}