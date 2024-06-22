import { useParams, useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentPage, removeAllPopups, setIsAuthenticated, setCurrentInviteLink, addPopup } from '../features/navigation/navigationSlice'
import { useEffect, useState, useRef, useCallback } from 'react'
import { getProjectMembersApi, getProjectByIdApi,inviteLinkApi } from '../apis/projectsApi'
import { refreshTokenApi } from '../apis/authApi'
import useApi from '../hooks/useApi'
import io from 'socket.io-client'
import { format } from 'date-fns'
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import SendIcon from '../svg/projects/SendIcon'
import EmojiIcon from '../svg/projects/EmojiIcon'
import AddMemberIcon from '../svg/projects/AddMemberIcon'

import '../css/pages/Chat.css'

export default function Project() {
  const { projectId } = useParams()
  
  const navigate = useNavigate()

  const myId = useSelector((state) => state.user.id)
  const myProfilePic = useSelector((state) => state.user.profilePic)
  const myName = useSelector((state) => state.user.name)
  const myTitle = useSelector((state) => state.user.title)

  const dispatch = useDispatch()

  const [loading, setLoading] = useState(true)
  const [project, setProject] = useState({})
  const [members, setMembers] = useState([])
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [socketError, setSocketError] = useState('')
  const [currentId, setCurrentId] = useState(myId)
  const [currentProfilePic, setCurrentProfilePic] = useState(myProfilePic)
  const [currentName, setCurrentName] = useState(myName)
  const [currentTitle, setCurrentTitle] = useState(myTitle)
  const [parentHeight, setParentHeight] = useState('auto')
  const [initialLoad, setInitialLoad] = useState(true)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)



  const socket = useRef(null)
  const messagesEndRef = useRef(null)
  const sideContainerRef = useRef(null)
  const parentContainerRef = useRef(null)
  const inputRef = useRef(null)

  const {
		fetchApi : fetchGetProjectByIdApi,
		apiData: getProjectByIdApiData,
		apiError: getProjectByIdApiError,
	} = useApi(getProjectByIdApi)

  const {
		fetchApi : fetchGetProjectMembersApi,
		apiData: getProjectMembersApiData,
		apiError: getProjectMembersApiError,
	} = useApi(getProjectMembersApi)

  const {
		fetchApi : fetchInviteLinkApi,
		apiData: inviteLinkApiData,
		apiError: inviteLinkApiError,
		apiLoading: inviteLinkApiLoading,
	} = useApi(inviteLinkApi)

  const initializeSocket = useCallback(async () => {
    try {
        const refreshToken = localStorage.getItem('refreshToken')
        const data = await refreshTokenApi(refreshToken)
        
        localStorage.setItem('accessToken', data.newAccessToken)
        localStorage.setItem('refreshToken', data.newRefreshToken)

        const accessToken = data.newAccessToken

        socket.current = io.connect('https://intime-9hga.onrender.com/', {
          extraHeaders: {
            'accessToken': accessToken
          },
        })

        socket.current.emit('joinProjectChat', {
          projectId: projectId
        })

        socket.current.on('chatMessage', (message) => {
          setMessages((prevMessages) => [...prevMessages, message.message])
        })

        socket.current.on('loadOldMessages', (history) => {
          setMessages(history)
        })

        socket.current.on('error', async (err) => {
          setSocketError('Socket error:', err)
        })
    } catch (error) {
        console.error('Failed refreshing token:', error)

        setIsAuthenticated(false)
    }
  }, [projectId])

  // change the current page so the app can rerender and update sidenav active icon and remove all popups
  useEffect(() => {
    dispatch(setCurrentPage('chat'))
    dispatch(removeAllPopups())
  }, [dispatch])

  // place caret at end
  useEffect(() => {
    if (!loading && inputRef.current && !inputValue) {
      inputRef.current.focus()
      placeCaretAtEnd(inputRef.current)
    }
  }, [inputValue, loading])

  // Attach click outside handler to close picker
  useEffect(() => {
    const handleClickOutsidePicker = (e) => {
      if (showEmojiPicker && e.target.closest('em-emoji-picker')) {
        return
      }

      setShowEmojiPicker(false)
    }
    
    document.addEventListener('mousedown', handleClickOutsidePicker)

    return () => {
      document.removeEventListener('mousedown', handleClickOutsidePicker)
    }
  }, [showEmojiPicker])

  //resize chat based on the 
  useEffect(() => {
    const adjustParentHeight = () => {
      if (sideContainerRef.current && parentContainerRef.current) {
        const sideHeight = sideContainerRef.current.offsetHeight
        const maxHeight = window.innerHeight - 123
        const newHeight = sideHeight < maxHeight ? `${maxHeight}px` : `${sideHeight}px`
        setParentHeight(newHeight)
      }
    }

    if (!loading) {
      adjustParentHeight()
    }

    window.addEventListener('resize', adjustParentHeight)

    const observer = new MutationObserver(adjustParentHeight)
    if (sideContainerRef.current) {
      observer.observe(sideContainerRef.current, { childList: true, subtree: true })
    }

    return () => {
      window.removeEventListener('resize', adjustParentHeight)
      observer.disconnect()
    }
  }, [loading])

  // apply socket
  useEffect(() => {
    const loadData = async () => {
      await fetchGetProjectByIdApi(projectId)

      await fetchGetProjectMembersApi(projectId)

      await initializeSocket()

      setLoading(false)
    }
    
    loadData()

    return () => {
      if (socket.current) {
        socket.current.disconnect()
      }
    }
  }, [fetchGetProjectMembersApi, fetchGetProjectByIdApi, initializeSocket, projectId])
  
  // fetch project api data
	useEffect(() => {
    if (getProjectByIdApiData?.record) {
      setProject(getProjectByIdApiData.record)
    }
	}, [getProjectByIdApiData])

  // fetch members api data
	useEffect(() => {
    if (getProjectMembersApiData?.record) {
      setMembers(getProjectMembersApiData.record)
    }
	}, [getProjectMembersApiData])

  // load link when its generated
	useEffect(() => {
    if (inviteLinkApiData) {
      dispatch(setCurrentInviteLink(inviteLinkApiData.link))

      dispatch(addPopup('invite link'))
    }
	}, [inviteLinkApiData, dispatch])

  // handel errors
  useEffect(() => {
    if (getProjectByIdApiError || getProjectMembersApiError || socketError) {
      navigate('/projects')
    }
  }, [getProjectByIdApiError, getProjectMembersApiError, socketError, navigate])

  // handle initial load and scrolling to bottom
  useEffect(() => {
    if (loading && messagesEndRef.current && initialLoad) {
      messagesEndRef.current.scrollIntoView({ behavior: 'auto' })
      setInitialLoad(false)
    } else {
      scrollToBottom()
    }
  }, [messages, initialLoad, loading])

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const placeCaretAtEnd = (el) => {
    const range = document.createRange()
    const sel = window.getSelection()
    range.selectNodeContents(el)
    range.collapse(false)
    sel.removeAllRanges()
    sel.addRange(range)
  }
  
  const openInvite = async () => {
    await fetchInviteLinkApi(project._id)
  }

  const handleInput = () => {
    if (inputRef.current) {
      setInputValue(inputRef.current.textContent)
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain')
    document.execCommand('insertText', false, text)
  }

  const toggleEmojis = () => {
    setShowEmojiPicker(!showEmojiPicker)
  }

  const handleSelectEmoji = (emoji) => {
    if (inputRef.current) {
      setShowEmojiPicker(!showEmojiPicker)
      
      inputRef.current.innerHTML += emoji.native

      handleInput()
    }
  }


  const sendMessage = () => {
    if (inputValue.trim() === '') return 
    
    if (socket.current) {
      socket.current.emit('message', {
        projectId: projectId,
        message: inputValue.trim()
      }) 
    
      inputRef.current.innerHTML = ''
      
      handleInput()
      scrollToBottom()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const isSameDay = (date1, date2) => {
    const d1 = new Date(date1)
    const d2 = new Date(date2)
  
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate()
  }
 
  if (loading) {
    return (
      <div />
    )
  }

  if (inviteLinkApiError) {
    console.log(inviteLinkApiError)
  }

  if (socketError) {
    console.log(socketError)
  }

  const adminId = project.members.find((projectMember) => projectMember.role === 'admin')?.memberId
  let previousSender = null
  
  return (
    <div className='main-content'>
        <div className='chat-page-container' ref={parentContainerRef}style={{ height: parentHeight }}>
          <div className='chat-page-left-section'>
            <div className='chat-page-info'>
              <p className='chat-page-group-name'>{project.name}</p>

              <p className='chat-page-members-count'>{project.members.length} member{project.members.length === 1 ? '' : 's'}</p>
            </div>

            <div className='chat-messages-container'>
              {
                messages.map((message, i) => {
                  const firstMessage = i === 0
                  const isSameDayAsPrevious = i > 0 && isSameDay(message.timestamp, messages[i - 1].timestamp)
                  const isSameUserAsPrevious = i > 0 && message.userId === messages[i - 1].userId
                  const isMe = message.userId === myId


                  let messageSender
                  if (isSameUserAsPrevious) {
                    messageSender = previousSender
                  } else {
                    messageSender = members.find((member) => member._id === message.userId)
                    previousSender = messageSender
                  }

                  return (
                    firstMessage || !isSameDayAsPrevious ? (
                      <div className='chat-single-message-container' key={message._id}>
                        <p className='chat-single-message-day'>
                          {isSameDay(message.timestamp, new Date().toISOString()) ? 'Today' : format(message.timestamp, 'MMMM d, yyyy')}
                        </p>

                        <div className={`chat-single-message ${isMe ? 'my-message' : ''}`} style={{marginTop: '30px'}}>
                          <img
                            src={`https://intime-9hga.onrender.com/api/v1/images/${messageSender.avatar}`}
                            alt='profile-pic'
                            className='chat-single-message-profile-pic'
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src = require('../assets/images/profile-pic.jpeg')
                            }}
                          />

                          <div className='chat-single-message-data'>
                            <div className='chat-single-message-data-upper-section'>
                              <p className='chat-single-message-sender'>{messageSender.name}</p>

                              <p className='chat-single-message-time first-message'>{format(message.timestamp, "h':'mm a").replace('AM', 'am').replace('PM', 'pm')}</p>
                            </div>
                            
                            <div className='chat-single-message-data-bottom-section first-message'>
                              <p>{message.message}</p>

                              <p className='chat-single-message-time hoverable'>{format(message.timestamp, "h':'mm a").replace('AM', 'am').replace('PM', 'pm')}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : isSameUserAsPrevious ? (
                      <div className={`chat-single-message ${isMe ? 'my-message' : ''}`} key={message._id} style={{marginTop: '8px'}}>
                        <div className='chat-single-message-profile-replacement'/>

                        <div className='chat-single-message-data'>                      
                          <div className='chat-single-message-data-bottom-section same-user'>
                            <p>{message.message}</p>

                            <p className='chat-single-message-time hoverable'>{format(message.timestamp, "h':'mm a").replace('AM', 'am').replace('PM', 'pm')}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className={`chat-single-message ${isMe ? 'my-message' : ''}`} key={message._id} style={{marginTop: '30px'}}>
                        <img
                          src={`https://intime-9hga.onrender.com/api/v1/images/${messageSender.avatar}`}
                          alt='profile-pic'
                          className='chat-single-message-profile-pic'
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = require('../assets/images/profile-pic.jpeg')
                          }}
                        />

                        <div className='chat-single-message-data'>
                          <div className='chat-single-message-data-upper-section'>
                            <p className='chat-single-message-sender'>{messageSender.name}</p>

                            <p className='chat-single-message-time first message'>{format(message.timestamp, "h':'mm a").replace('AM', 'am').replace('PM', 'pm')}</p>
                          </div>
                          
                            <div className='chat-single-message-data-bottom-section first-message'>
                              <p>{message.message}</p>
                              
                              <p className='chat-single-message-time hoverable'>{format(message.timestamp, "h':'mm a").replace('AM', 'am').replace('PM', 'pm')}</p>
                            </div>
                        </div>
                      </div>
                    )
                  )
                })
              }
              
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-container">
              <div className="chat-input-text-group" onClick={() => inputRef.current.focus()}>
                <div
                  className="chat-input-text"
                  contentEditable
                  ref={inputRef}
                  onInput={handleInput}
                  onPaste={handlePaste}
                  onKeyDown={handleKeyDown}
                  spellCheck='false'
                  autoComplete='off'
                />

                {
                  inputValue === '' && (
                    <div className="chat-placeholder">Message</div>
                  )
                }
              </div>

              <div className='chat-input-svg-container'>
                <SendIcon sendMessage={sendMessage}/>

                <EmojiIcon toggleEmojis={toggleEmojis}/>
              </div>

              {showEmojiPicker && (
                <Picker data={data} onEmojiSelect={handleSelectEmoji} theme={'light'} icons={'solid'} emojiSize={18} autoFocus={true} previewPosition={'none'} />
              )}
            </div>
          </div>

          <div className='chat-page-right-section' ref={sideContainerRef}>
            <div className='chat-page-right-top-section'>
              <Link to={`/profile/${currentId}`}>
                <img
                  src={currentProfilePic}
                  alt='profile-pic'
                  className='chat-page-current-profile-pic'
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = require('../assets/images/profile-pic.jpeg')
                  }}
                />
              </Link>

              <p className='chat-page-current-member-name'>{currentName}</p>

              <p className='chat-page-current-member-title'>{currentTitle}</p>
          </div>

          <div className='chat-page-right-middle-section'>
            <p>Members</p>

            {
               myId === adminId && (
                <div className='chat-page-right-add-member-container' onClick={openInvite} style={{ pointerEvents: inviteLinkApiLoading ? 'none' : '', cursor: inviteLinkApiLoading ? 'auto' : 'pointer' }}>
                  <AddMemberIcon />
                  
                  <p>Add Member</p>
                </div>
              )
            }

          </div>

          <div className='chat-page-right-bottom-section'>
            {
              members.map((member) => (
                <div className='chat-page-right-member' key={member._id} onClick={() => {
                  setCurrentId(member._id)
                  setCurrentProfilePic(`https://intime-9hga.onrender.com/api/v1/images/${member.avatar}`)
                  setCurrentName(member.name)
                  setCurrentTitle(member.title)
                }}>
                  <img
                    src={`https://intime-9hga.onrender.com/api/v1/images/${member.avatar}`}
                    alt='profile-pic'
                    className='chat-page-right-member-profile-pic'
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = require('../assets/images/profile-pic.jpeg')
                    }}
                  />

                  <p className='chat-page-right-member-name'>{member.name}</p>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}