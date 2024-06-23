import { useDispatch, useSelector } from 'react-redux'
import { setCurrentPage, removeAllPopups } from '../features/navigation/navigationSlice'
import { useEffect } from 'react'
import { format, isToday, isYesterday } from 'date-fns'
import ActionIcon from '../svg/notifications/ActionIcon'
import MissedIcon from '../svg/notifications/MissedIcon'
import '../css/pages/Notifications.css'

export default function Notifications() {
  const notifications = useSelector((state) => state.user.notifications).slice().reverse().slice(0, 30)

  const dispatch = useDispatch()

  // change the current page so the app can rerender and update sidenav active icon and reset the unread count to 0 and remove all popups
  useEffect(() => {
    dispatch(setCurrentPage('notifications'))
    dispatch(removeAllPopups())
  }, [dispatch])

  const getNotificationDay = (date) => {
    if (isToday(date)) {
        return `today, at ${format(date, 'h:mm a').replace('AM', 'am').replace('PM', 'pm')}`;
    } else if (isYesterday(date)) {
        return `yesterday, at ${format(date, 'h:mm a').replace('AM', 'am').replace('PM', 'pm')}`;
    } else {
        return `${format(date, "EEE',' 'at' h:mm a").replace('AM', 'am').replace('PM', 'pm')}`;
    }
}

  return (
    <div className='main-content'>
      <p className='page-name'>Notifications</p>

      <div className='all-notifications-container'>
        {
          notifications.map((notification) => (
            <div key={notification._id} className='single-notification-container'>
              {
                notification.message.includes("time is up") ? (
                  <MissedIcon />
                ) : (
                  <ActionIcon />
                )
              }

              {notification.message}

              <p className='single-notifications-date'>
                {getNotificationDay(notification.date)}
              </p>
            </div>
          ))
        }
      </div>
    </div>
  )
}