import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import '../CSS/Components/SideNav.css'
import HomeIcon from '../SVG/SideNav/HomeIcon'
import TasksIcon from '../SVG/SideNav/TasksIcon'
import CalendarIcon from '../SVG/SideNav/CalendarIcon'
import SideNotificationsIcon from '../SVG/SideNav/SideNotificationsIcon'
import SettingsIcon from '../SVG/SideNav/SettingsIcon'

export default function SideNav() {
  const [scrollPosition, setScrollPosition] = useState(window.scrollY)
  const [hasExceededThreshold, setHasExceededThreshold] = useState(false)
  const [sideNavActive, setSideNavActive] = useState(false)  
  const sideNavParentRef = useRef(null)
  const currentPage = useSelector((state) => state.navigation.currentPage)

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
    if (sideNavActive) {
      setSideNavActive(false)
    }
  }, [currentPage])
  
  // activate/disable wide sidenav
  const handleSideNavClick = (event) => {
    if(event.target === sideNavParentRef.current ||
       event.target.parentElement === sideNavParentRef.current) {
      setSideNavActive(!sideNavActive)
    }
  }
  
  // adjust sidenav height according to scrollbar and its width according to the sidenav state
  const sideNavContainerStyles = {
    top: scrollPosition < 79 ? 79 - scrollPosition : 0,
    height: scrollPosition < 79 ? `calc(100% - 79px + ${scrollPosition}px)` : '100%',
    width: sideNavActive ? 180 : 78,
  }

  // adjust sidenav icons according to sidenav state
  const sideNavStyles = {
    alignItems: sideNavActive ? 'flex-end' : 'center',
    marginLeft: sideNavActive ? 25 : 0
  }

  const navigationPages = [
    { path: '/', label: 'Home', icon: <HomeIcon /> },
    { path: '/tasks', label: 'Tasks', icon: <TasksIcon /> },
    { path: '/calendar', label: 'Calendar', icon: <CalendarIcon /> },
    { path: '/notifications', label: 'Notifications', icon: <SideNotificationsIcon /> },
    { path: '/settings', label: 'Settings', icon: <SettingsIcon /> },
  ]

  return (
    <div className='side-nav-container no-select' style={sideNavContainerStyles} ref={sideNavParentRef} onClick={handleSideNavClick}>
      <div className='side-nav' style={sideNavStyles}>
        {navigationPages.map(({ path, label, icon }) => (
          <Link to={path} key={path}>
            {sideNavActive && (
              <p className='side-nav-page' style={{ color: currentPage === path.slice(1) ? '#5468E7' : 'black' }}>
                {label}
              </p>
            )}
            {icon}
          </Link>
        ))}
      </div>
    </div>
  )
}