import { useDispatch } from 'react-redux'
import { removeAllPopups, setCurrentPage } from '../features/navigation/navigationSlice'
import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import '../css/pages/Intro.css'

export default function Intro() {
  const dispatch = useDispatch()

  const containerRef = useRef(null)

  // change the current page so the app can rerender and update sidenav active icon and remove all popups
  useEffect(() => {
    dispatch(setCurrentPage(''))
    dispatch(removeAllPopups())
  }, [dispatch])

  //change the min-width for the page depending if there is a scroll or if there is not
  useEffect(() => {
    const adjustHeight = () => {
      if (containerRef.current) {
        const hasHorizontalScrollbar = document.body.scrollWidth > window.innerWidth
        if (hasHorizontalScrollbar) {
          containerRef.current.style.minHeight = `calc(100vh - 8px)`
        } else {
          containerRef.current.style.minHeight = '100vh'
        }
      }
    }

    adjustHeight()

    window.addEventListener('resize', adjustHeight)

    return () => {
      window.removeEventListener('resize', adjustHeight)
    }
  }, [containerRef])
  
  return (
    <div className='intro-page-container' ref={containerRef}>
      <div className='intro-page-left'>
        <p className='intro-app-logo-text'>
          In <span>Time</span>
        </p>

        <p className='intro-page-disc'>
          Organize and manage your team like a boss with<br/>
          InTime, a free task management tool packing<br/>
          more capabilities than you can imagine
        </p>

        <div className='intro-links-container'>
          <Link to='/signup' >Get Started</Link>
          
          <Link to='/signin' >Sign In</Link>
        </div>
      </div>
      
      <img src={require("../assets/images/Hero image.png")} alt="intro-hero-img" className='intro-hero-img' />
    </div>
  )
}