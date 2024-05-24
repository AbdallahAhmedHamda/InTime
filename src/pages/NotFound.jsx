import { useDispatch } from 'react-redux'
import { removeAllPopups, setCurrentPage } from '../features/navigation/navigationSlice'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../css/pages/NotFound.css'

export default function NotFound() {
  const dispatch = useDispatch()

  // change the current page so the app can rerender and update sidenav active icon and remove all popups
  useEffect(() => {
    dispatch(setCurrentPage('notFound'))
    dispatch(removeAllPopups())
    // eslint-disable-next-line
  }, [])
  
  return (
    <div className="not-found-container">
        <h1>404</h1>

        <p>Oops! The page you are looking for could not be found.</p>

        <Link to='/home' >Go back to homepage</Link>
    </div>
  )
}