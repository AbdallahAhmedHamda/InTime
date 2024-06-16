import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentPage, removeAllPopups, setIsAuthenticated } from '../features/navigation/navigationSlice'
import { useEffect, useState } from 'react'
import { signOutApi } from '../apis/authApi'

import '../css/pages/Profile.css'

export default function Profile() {
  const navigate = useNavigate()

  const profilePic = useSelector((state) => state.user.profilePic)
  const name = useSelector((state) => state.user.name)
  const title = useSelector((state) => state.user.title)
  const level = useSelector((state) => state.user.level)
  const rank = useSelector((state) => state.user.rank)
  const completedTasks = useSelector((state) => state.user.completedTasks.overall)
  const about = useSelector((state) => state.user.about)

  const [disabled, setDisabled] = useState(false)

  const dispatch = useDispatch()

  // change the current page so the app can rerender and update sidenav active icon and remove all popups
  useEffect(() => {
    dispatch(setCurrentPage('profile'))
    dispatch(removeAllPopups())
  }, [dispatch])

  const logout = async () => {
    const refreshToken = localStorage.getItem('refreshToken')

    setDisabled(true)

    try {
      await signOutApi(refreshToken)
      
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('accessToken')
      
      dispatch(setIsAuthenticated(false))
      
      navigate('/signin')
    } catch (error) {
      console.error('Error in logging out:', error.message)
    } finally {
      setDisabled(false)
    }
  }

  return (
    <div className='main-content'>
      <p className='page-name'>Profile</p>

      <div className='profile-page-container'>
        <div className='profile-page-profile-pic-container'>
          <img 
            alt='profilePic' 
            src={profilePic}
            className='profile-page-profile-pic'
            onError={(e) => {
              e.target.onerror = null
              e.target.src = require('../assets/images/profile-pic.jpeg')
            }}
          />
        </div>
        
        <div className='profile-page-name-container'>
          <p className='profile-page-name'>{name}</p>

          <p className='profile-page-title'>{title}</p>
        </div>

        <div className='profile-page-stats-container'>
          <div>
            <p className='profile-page-level'>{level}</p>

            <span>level</span>
          </div>

          <svg width="3" height="69" viewBox="0 0 3 69" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="1.55789" height="68.7719" transform="matrix(-1 0 0 1 2.021 0.00354004)" fill="#6C6C6C"/>
          </svg>
          
          <div>
            <p className='profile-page-rank'>{rank}</p>

            <span>rank</span>
          </div>

          <svg width="3" height="69" viewBox="0 0 3 69" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="1.55789" height="68.7719" transform="matrix(-1 0 0 1 2.021 0.00354004)" fill="#6C6C6C"/>
          </svg>

          <div>
            <p className='profile-page-completed-tasks'>{completedTasks}</p>

            <span>tasks done</span>
          </div>
        </div>

        <p className='profile-page-about'>{about}</p>

        <button className='profile-page-logout' onClick={logout} disabled={disabled}>Logout</button>
      </div>
    </div>
  )
}