import { useDispatch } from 'react-redux'
import { setCurrentPage, removeAllPopups } from '../features/navigation/navigationSlice'
import { useEffect } from 'react'

import '../css/pages/Profile.css'

export default function Profile() {
  const dispatch = useDispatch()
  
  // change the current page so the app can rerender and update sidenav active icon and remove all popups
  useEffect(() => {
    dispatch(setCurrentPage('projects'))
    dispatch(removeAllPopups())
  }, [dispatch])

  return (
    <div className='main-content'>
      <p className='page-name'>Projects</p>
    </div>
  )
}