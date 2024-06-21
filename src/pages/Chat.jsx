import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCurrentPage, removeAllPopups, setIsAuthenticated } from '../features/navigation/navigationSlice'
import { refreshTokenApi } from '../apis/authApi'
import { useEffect, useState, useRef } from 'react'
import io from 'socket.io-client'

export default function Project() {
  const { projectId } = useParams()
  
  const dispatch = useDispatch()

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [error, setError] = useState('')

  const socket = useRef(null)

  // change the current page so the app can rerender and update sidenav active icon and remove all popups
  useEffect(() => {
    dispatch(setCurrentPage('chat'))
    dispatch(removeAllPopups())
  }, [dispatch])

  const initializeSocket = async () => {
    try {
        const refreshToken = localStorage.getItem('refreshToken')
        const data = await refreshTokenApi(refreshToken)
        
        localStorage.setItem('accessToken', data.newAccessToken)
        localStorage.setItem('refreshToken', data.newRefreshToken)

        const accessToken = data.newAccessToken

        socket.current = io.connect('https://intime-9hga.onrender.com/', {
          headers: {
            'accesstoken': accessToken
          }
        })

        socket.current.emit('joinProjectChat', {
          projectId: '666f98c51116a0c7809d687d'
        })

        socket.current.on('chatMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message])
        })

        socket.current.on('loadOldMessages', (history) => {
          console.log('here')
          if (messages.length === 0) {
            setMessages(history)
          }
        })

        socket.current.on('error', async (err) => {
          console.error('Socket error:', err)
        })

        console.log(socket.current)
        // return () => {
        //     socket.current.disconnect()
        // }
    } catch (error) {
        console.error('Failed refreshing token:', error)

        // setIsAuthenticated(false)
    }
  }


  // apply socket
  useEffect(() => {
    initializeSocket()
  }, [])

  const sendMessage = () => {
    if (input.trim() === '') return 

    if (socket.current) {
        socket.current.emit('message', {
          projectId: projectId,
          message: input
        }) 
        
        setInput('')
    }
}

  if (error) {
    console.log(error)
  }

  return (
    <div className='main-content'>
      <div className="board-header">
        <p className='page-name'>Chat</p>
      </div>
    </div>
  )
}