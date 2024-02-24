import { useEffect } from 'react'
import { useDispatch, } from 'react-redux'
import { setCurrentPage, removeAllPopups } from '../features/navigation/navigationSlice'
import { removeUnread } from '../features/user/userSlice'
import '../css/pages/Notifications.css'

export default function Notifications() {
  const dispatch = useDispatch()

  // change the current page so the app can rerender and update sidenav active icon and reset the unread count to 0
  useEffect(() => {
    dispatch(setCurrentPage('notifications'))
    dispatch(removeAllPopups())
    dispatch(removeUnread())
  }, [dispatch])

  return (
    <div>
      <p className='page-name'>Notifications</p>
    </div>
  )
}