import { useSelector, useDispatch } from 'react-redux'
import { addPopup } from '../../features/navigation/navigationSlice'
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTransition, animated } from 'react-spring'
import NavNotificationsIcon from '../../svg/navbar/NavNotificationsIcon'
import DownArrowIcon from '../../svg/navbar/DownArrowIcon'
import AddTaskIcon from '../../svg/navbar/AddTaskIcon'
import LogoutIcon from '../../svg/navbar/LogoutIcon'
import SearchIcon from '../../svg/navbar/SearchIcon'
import '../../css/components/Navbar.css'

export default function Navbar() {
  const currentPage = useSelector((state) => state.navigation.currentPage)
  const name = useSelector((state) => state.user.name)
  const profilePic = useSelector((state) => state.user.profilePic)
  const level = useSelector((state) => state.user.level)
  const unreadNotifications = useSelector((state) => state.user.unreadNotifications)

  const dispatch = useDispatch()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(window.scrollY)
  const [hasExceededThreshold, setHasExceededThreshold] = useState(false)
  
  const accountDropdownRef = useRef(null)

  // hide account dropdown when user changes the page
  useEffect(() => {
    if (showDropdown) {
      setShowDropdown(false)
    }
    // eslint-disable-next-line
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
    if (searchTerm) {
      console.log('Searching for:', searchTerm)
    }
  }

  const onKeyDownHandler = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
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
      <Link to='/' >
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
          type='text'
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
          <Link to='/settings' >
            <img
              src={profilePic}
              alt='profile-pic'
              className='navbar-profile-pic'
            />
          </Link>

          <p className='navbar-username'>{name}</p>

          <div className='account-dropdown-container no-select' ref={accountDropdownRef}>
            <DownArrowIcon toggle={toggleAccountDropdown} isOpen={showDropdown}/>

            {
              dropdownTransition((style, item) => item && (
                <animated.div className='account-dropdown' style={style}>
                  <p>Switch account</p>

                  <hr />

                  <div className='logout-container'>
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