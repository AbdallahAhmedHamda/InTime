import { useSelector } from 'react-redux'
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import SideNotificationsIcon from '../../svg/sideNav/SideNotificationsIcon'
import SettingsIcon from '../../svg/sideNav/SettingsIcon'
import CalendarIcon from '../../svg/sideNav/CalendarIcon'
import TasksIcon from '../../svg/sideNav/TasksIcon'
import HomeIcon from '../../svg/sideNav/HomeIcon'
import '../../css/components/SideNav.css'

export default function SideNav() {
  const currentPage = useSelector((state) => state.navigation.currentPage)
  
  const [scrollPosition, setScrollPosition] = useState(window.scrollY)
  const [hasExceededThreshold, setHasExceededThreshold] = useState(false)
  const [sideNavActive, setSideNavActive] = useState(false)
  
  const sideNavParentRef = useRef(null)

  // rerender the app when the navbar is still on screen so sidenav can adjust its height
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPosition = window.scrollY

      if(!hasExceededThreshold) {
        if (currentScrollPosition < 79) {
          setScrollPosition(currentScrollPosition)
        } else {
          setScrollPosition(currentScrollPosition)
          setHasExceededThreshold(true)
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
  
  // reset sidenav to its original size whenever i redirect
	useEffect(() => {
    setSideNavActive(false)
  }, [currentPage])
  
  // disable wide sidenav when user clicks outside it
  useEffect(() => {
    const handleClickOutsideDropdown = (e) => {
      if(sideNavActive && !sideNavParentRef.current.contains(e.target)) {
        setSideNavActive(false)
      }
    }
    
    document.addEventListener('click', handleClickOutsideDropdown)

    return () => {
      document.removeEventListener('click', handleClickOutsideDropdown)
    }
  }, [sideNavActive])
  
  // activate/disable wide sidenav
  const handleSideNavClick = (e) => {
    if(e.target === sideNavParentRef.current ||
       e.target.parentElement === sideNavParentRef.current) {
      setSideNavActive(!sideNavActive)
    }
  }
  
  const sideNavContainerStyles = {
    top: scrollPosition < 79 ? 79 - scrollPosition : 0,
    width: sideNavActive ? 180 : 78,
    height: scrollPosition < 79 ? `calc(100% - 79px + ${scrollPosition}px)` : '100%',
  }

  const sideNavStyles = {
    alignItems: sideNavActive ? 'flex-end' : 'center',
    marginLeft: sideNavActive ? 25 : 0
  }

  const navigationPages = [
    { path: '/home', label: 'Home', icon: <HomeIcon /> },
    { path: '/tasks', label: 'Tasks', icon: <TasksIcon /> },
    { path: '/calendar', label: 'Calendar', icon: <CalendarIcon /> },
    { path: '/notifications', label: 'Notifications', icon: <SideNotificationsIcon /> },
    { path: '/settings', label: 'Settings', icon: <SettingsIcon /> },
  ]

  return (
    <div
      className='side-nav-container no-select'
      style={sideNavContainerStyles}
      ref={sideNavParentRef}
      onClick={handleSideNavClick}
    >
      <div className='side-nav' style={sideNavStyles}>
        {
          navigationPages.map(({ path, label, icon }) => (
            <Link to={path} key={path}>
              {
                sideNavActive && (
                  <p
                    className='side-nav-page'
                    style={{
                      color: currentPage === path.slice(1) ? '#5468E7' : 'black'
                    }}
                  >
                    {label}
                  </p>
                )
              }
              {icon}
            </Link>
          ))
        }
      </div>
    </div>
  )
}