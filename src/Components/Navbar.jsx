import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useTransition, animated } from 'react-spring';
import '../CSS/Components/Navbar.css'
import SearchIcon from '../SVG/Navbar/SearchIcon'
import NavNotificationsIcon from '../SVG/Navbar/NavNotificationsIcon'
import DownArrowIcon from '../SVG/Navbar/DownArrowIcon'
import AddTaskIcon from '../SVG/Navbar/AddTaskIcon'
import LogoutIcon from '../SVG/Navbar/LogoutIcon'

export default function Navbar() {
  const currentPage = useSelector((state) => state.navigation.currentPage)
  const name = useSelector((state) => state.user.name)
  const profilePic = useSelector((state) => state.user.profilePic)
  const level = useSelector((state) => state.user.level)
  const unreadNotifications = useSelector((state) => state.user.unreadNotifications)
  
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
    const handleClickOutsideDropdown = (event) => {
      if(showDropdown && !accountDropdownRef.current.contains(event.target)) {
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

  // test
  const handleSearch = () => {
    console.log('Searching for:', searchTerm)
  }

  // show/hide account dropdown
  const toggleAccountDropdown = () => {
    setShowDropdown(!showDropdown)
}

  // animate account dropdown
  const dropdownTransition = useTransition(showDropdown, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 300 }
  })

  // adjust navbar position so it goes out of screnn when user scrolls down
  const navbarStyles = {
    top: scrollPosition < 79 ? 0 -scrollPosition : -79,
  }
  
  return (
    <header style={navbarStyles}>
      <Link to="/" >
        <img src={require('../Images/logo.png')} alt='logo' className='app-logo' />
        <p className='app-logo-text'>
          In
          <span>Time</span>
        </p>
      </Link>

      <div className='search-bar'>
        <input
          type="text"
          placeholder="Search anything..."
          name='searchTerm'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button onClick={handleSearch}>
          <SearchIcon />
        </button>
      </div>

      <div className='user-accessibility'>
        <AddTaskIcon />

        <p className='navbar-level'>Level {level}</p>

        <Link to="/notifications" >
          <div className='navbar-notifications'>
            <NavNotificationsIcon />
            {unreadNotifications > 0 && (
              <div className='notification-number'>{unreadNotifications}</div>
            )}
          </div>
        </Link>

        <div className='navbar-user-info'>
          <Link to="/settings" >
            <img src={profilePic} alt='profile-pic' className='navbar-profile-pic'/>
          </Link>

          <p className='navbar-username'>{name}</p>

          <div className='account-dropdown-container no-select' ref={accountDropdownRef}>
            <DownArrowIcon toggle={toggleAccountDropdown} isOpen={showDropdown}/>

            {dropdownTransition((style, item) => item && (
              <animated.div className='account-dropdown' style={style}>
                <p>Switch account</p>

                <hr />

                <div className='logout-container'>
                  <LogoutIcon /> 
                  
                  <p>Logout</p>
                </div>
              </animated.div>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}