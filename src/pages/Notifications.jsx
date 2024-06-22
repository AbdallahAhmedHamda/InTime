import { useDispatch, } from 'react-redux'
import { setCurrentPage, removeAllPopups } from '../features/navigation/navigationSlice'
import { useEffect } from 'react'
import '../css/pages/Notifications.css'

export default function Notifications() {
  const dispatch = useDispatch()

  // change the current page so the app can rerender and update sidenav active icon and reset the unread count to 0 and remove all popups
  useEffect(() => {
    dispatch(setCurrentPage('notifications'))
    dispatch(removeAllPopups())
  }, [dispatch])

  return (
    <div className='main-content'>
      <p className='page-name'>Notifications</p>
    </div>
  )
}