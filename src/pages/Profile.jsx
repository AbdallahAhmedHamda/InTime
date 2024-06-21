import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentPage, removeAllPopups, setIsAuthenticated, resetNavigationState } from '../features/navigation/navigationSlice'
import { resetUserState } from '../features/user/userSlice'
import { useEffect, useState,useMemo } from 'react'
import { signOutApi } from '../apis/authApi'

import '../css/pages/Profile.css'

export default function Profile() {
  const navigate = useNavigate()

  const { id } = useParams()

  const index = useSelector((state) => state.navigation.allRanks.findIndex((user) => user._id === id))
  const user = useSelector((state) => state.navigation.allRanks.find((user) => user._id === id))
  const currentUserId = useSelector((state) => state.user.id)

  // Select state from the Redux store
  const thisUserName = useSelector((state) => state.user.name)
  const thisUserTitle = useSelector((state) => state.user.title)
  const thisUserAbout = useSelector((state) => state.user.about)
  const thisUserProfilePic = useSelector((state) => state.user.profilePic)

  // Memoize thisUserData to prevent unnecessary re-renders
  const thisUserData = useMemo(() => ({
    name: thisUserName,
    title: thisUserTitle,
    about: thisUserAbout,
    profilePic: thisUserProfilePic
  }), [thisUserName, thisUserTitle, thisUserAbout, thisUserProfilePic])

  const [disabled, setDisabled] = useState(false)

  const dispatch = useDispatch()
  
  const [profilePic, setprofilePic] = useState('')
  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [level, setLevel] = useState('')
  const [rank, setRank] = useState('')
  const [completedTasks, setCompletedTasks] = useState('')
  const [about, setAbout] = useState('')

  // change the current page so the app can rerender and update sidenav active icon and remove all popups
  useEffect(() => {
    dispatch(setCurrentPage('profile'))
    dispatch(removeAllPopups())
  }, [dispatch])

  // Effect to handle navigation if user is not found
  useEffect(() => {
    if (index === -1) {
      navigate('/notFound')
    } else if (id === currentUserId) {
      setprofilePic(thisUserData.profilePic)
      setName(thisUserData.name)
      setTitle(thisUserData.title)
      setLevel(Math.floor(user.points.totalPoints / 100) + 1)
      setRank(index + 1)
      setCompletedTasks(user.tasks.completedTasks)
      setAbout(thisUserData.about)
    } else {
      setprofilePic(`https://intime-9hga.onrender.com/api/v1/images/${user.avatar}`)
      setName(user.name)
      setTitle(user?.title ? user.title : '')
      setLevel(Math.floor(user.points.totalPoints / 100) + 1)
      setRank(index + 1)
      setCompletedTasks(user.tasks.completedTasks)
      setAbout(user?.about ? user.about.replace(/\r\n/g, '\n') : '')
    }
  }, [index, user, thisUserData, currentUserId, id, navigate])

  const logout = async () => {
    const refreshToken = localStorage.getItem('refreshToken')

    setDisabled(true)

    try {
      await signOutApi(refreshToken)
      
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('accessToken')
      
      dispatch(setIsAuthenticated(false))
      dispatch(resetNavigationState())
      dispatch(resetUserState())
      
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

        { 
          id === currentUserId &&
          <button className='profile-page-logout' onClick={logout} disabled={disabled}>Logout</button>
        }

      </div>
    </div>
  )
}