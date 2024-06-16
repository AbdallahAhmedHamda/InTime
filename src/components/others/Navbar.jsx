import { Link, useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { addPopup, setIsAuthenticated } from '../../features/navigation/navigationSlice'
import { useState, useEffect, useRef } from 'react'
import { useTransition, animated } from 'react-spring'
import { signOutApi } from '../../apis/authApi'
import NavNotificationsIcon from '../../svg/navbar/NavNotificationsIcon'
import DownArrowIcon from '../../svg/navbar/DownArrowIcon'
import AddTaskIcon from '../../svg/navbar/AddTaskIcon'
import LogoutIcon from '../../svg/navbar/LogoutIcon'
import SearchIcon from '../../svg/navbar/SearchIcon'
import '../../css/components/Navbar.css'

export default function Navbar() {
  const navigate = useNavigate()

  const { searchValue } = useParams()

  const currentPage = useSelector((state) => state.navigation.currentPage)
  const name = useSelector((state) => state.user.name)
  const title = useSelector((state) => state.user.title)
  const profilePic = useSelector((state) => state.user.profilePic)
  const level = useSelector((state) => state.user.level)
  const unreadNotifications = useSelector((state) => state.user.unreadNotifications)

  const dispatch = useDispatch()
  
  const [searchTerm, setSearchTerm] = useState(searchValue || '')
  const [showDropdown, setShowDropdown] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(window.scrollY)
  const [hasExceededThreshold, setHasExceededThreshold] = useState(false)
  const [disabled, setDisabled] = useState(false)

  const accountDropdownRef = useRef(null)

  // hide account dropdown when user changes the page
  useEffect(() => {
    setShowDropdown(false)
  }, [currentPage])

  // hide account dropdown when user clicks outside it
  useEffect(() => {
    const handleClickOutsideDropdown = (e) => {
      if(showDropdown && !accountDropdownRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    
    document.addEventListener('click', handleClickOutsideDropdown)

    return () => {
      document.removeEventListener('click', handleClickOutsideDropdown)
    }
  }, [showDropdown])

  // rerender the app when the navbar is still on screen so it adjust its position
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPosition = window.scrollY

      if(!hasExceededThreshold) {
        if (currentScrollPosition < 79) {
          setScrollPosition(currentScrollPosition)
        } else {
          setScrollPosition(currentScrollPosition)
          setHasExceededThreshold(true)
          setShowDropdown(false)
        }
      } else {
        if (currentScrollPosition < 79) {
          setHasExceededThreshold(false)
          setScrollPosition(currentScrollPosition)
        }
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [hasExceededThreshold])

  const toggleAccountDropdown = () => {
    setShowDropdown(!showDropdown)
  }

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search/${searchTerm.trim()}`)
    }
  }

  const onKeyDownHandler = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

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

  const dropdownTransition = useTransition(showDropdown, {
    from: { opacity: 0, pointerEvents: 'none' },
    enter: { opacity: 1, pointerEvents: 'auto' },
    leave: { opacity: 0, pointerEvents: 'none' },
    config: { duration: 300 }
  })

  const navbarStyles = {
    top: scrollPosition < 79 ? 0 -scrollPosition : -79,
  }
  
  return (
    <header style={navbarStyles}>
      <Link to='/home' >
        <img
          src={require('../../assets/images/logo.png')}
          alt='logo'
          className='app-logo'
        />

        <p className='app-logo-text'>
          In <span>Time</span>
        </p>
      </Link>

      <div className='search-bar'>
        <input
          autoComplete='on'
          spellCheck='false'
          type='text'
          id='searchBar'
          placeholder='Search anything...'
          name='searchTerm'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={onKeyDownHandler}
        />

        <button onClick={handleSearch}>
          <SearchIcon />
        </button>
      </div>

      <div className='user-accessibility'>
        <AddTaskIcon showPopup={() => dispatch(addPopup('add'))}/>

        <p className='navbar-level'>Level {level}</p>

        <Link to='/notifications' >
          <div className='navbar-notifications'>
            <NavNotificationsIcon />

            {
              unreadNotifications > 0 && (
                <div className='notification-number'>{unreadNotifications}</div>
              )
            }
          </div>
        </Link>

        <div className='navbar-user-info'>
          <Link to='/profile' >
            <img
              src={profilePic}
              alt='profile-pic'
              className='navbar-profile-pic'
              onError={(e) => {
                e.target.onerror = null
                e.target.src = require('../../assets/images/profile-pic.jpeg')
              }}
            />
          </Link>

          <div className='navbar-username-container'>
            <p className='navbar-username'>{name}</p>
            
            <p className='navbar-title'>{title}</p>
          </div>

          <div className='account-dropdown-container no-select' ref={accountDropdownRef}>
            <DownArrowIcon toggle={toggleAccountDropdown} isOpen={showDropdown}/>

            {
              dropdownTransition((style, item) => item && (
                <animated.div className='account-dropdown' style={style}>
                  <div className='logout-container' onClick={logout} style={{ pointerEvents: disabled ? 'none' : '', cursor: disabled ? 'auto' : '' }}>
                    <LogoutIcon /> 
                    
                    <p>Logout</p>
                  </div>
                </animated.div>
              ))
            }
          </div>
        </div>
      </div>
    </header>
  )
}