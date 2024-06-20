import { useDispatch } from 'react-redux'
import { incrementRenderCount, removeAllPopups, removePopup } from '../../features/navigation/navigationSlice'
import { useEffect, useState } from 'react'
import { joinProjectApi } from '../../apis/projectsApi'
import useApi from '../../hooks/useApi'
import CloseIcon from '../../svg/others/CloseIcon'
import '../../css/components/Messages.css'

export default function JoinProject() {
  const dispatch = useDispatch()

  const [link, setLink] = useState('')
  const [linkError, setLinkError] = useState('')
  const [apiCallAttempt, setApiCallAttempt] = useState(0)

  const {
		fetchApi : fetchJoinProjectApi,
		apiData: joinProjectApiData,
		apiError: joinProjectApiError,
		apiLoading: joinProjectApiLoading
	} = useApi(joinProjectApi)

  // close popups on complete
  useEffect(() => {
    if (joinProjectApiData) {
      dispatch(removeAllPopups())

      dispatch(incrementRenderCount())
    }
  }, [joinProjectApiData, dispatch])

  // handle join api errors
	useEffect(() => {
    if (joinProjectApiError === 'user already a member of the project') {
      setLinkError('You are already a member of this project!')
    } else if (joinProjectApiError === 'Invalid OTP') {
      setLinkError('Incorrect Link!')
    } else if (joinProjectApiError) {
      console.log(joinProjectApiError)
    }
	}, [joinProjectApiError, apiCallAttempt, dispatch])

  const joinProject = async(e) => {
    e.preventDefault()
    
    await fetchJoinProjectApi(link)

    setApiCallAttempt(prevAttempts => prevAttempts + 1)
  }
  
  return (
    <form
      className='message-popup ' 
      onSubmit={joinProject}
    >
      <div  className='message-heading'>
        <p>Join Project</p>
        
        <CloseIcon
          className='close-message'
          onClick={() => dispatch(removePopup('join project'))}
        />
      </div>

      <div className='join-input-block'>
          <input
            autoFocus
            spellCheck='false'
            autoComplete='off'
            required={true}
            pattern='.*\S+.*'
            title='Include other letters than space!'
            className='project-join-link-input'
            type='text'
            name='link'
            id='link'
            value={link}
            onChange={(e) => {
              setLink(e.target.value)
              setLinkError('')
            }}
            placeholder='Project Link'
          />

          {linkError ? <p className='link-error'>{linkError}</p> : ''}
        </div>

        <button className='join-project-button' type='submit'  disabled={joinProjectApiLoading}>
          join
        </button>
    </form>
  )
}