import { useDispatch } from 'react-redux'
import { setCurrentPage, removeAllPopups } from '../features/navigation/navigationSlice'
import { useEffect, useState } from 'react'
import { getNotificationsApi } from '../apis/userApi'
import useApi from '../hooks/useApi'
import { format, isToday, isYesterday } from 'date-fns'
import ActionIcon from '../svg/notifications/ActionIcon'
import MissedIcon from '../svg/notifications/MissedIcon'
import '../css/pages/Notifications.css'

export default function Notifications() {
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState([])

  const {
		fetchApi : fetchGetNotificationsApi,
		apiData: getNotificationsApiData,
		apiError: getNotificationsApiError,
	} = useApi(getNotificationsApi)

  // change the current page so the app can rerender and update sidenav active icon and reset the unread count to 0 and remove all popups
  useEffect(() => {
    dispatch(setCurrentPage('notifications'))
    dispatch(removeAllPopups())
  }, [dispatch])

  // load notifications
	useEffect(() => {
		const fetchApis = async () => {	
      await fetchGetNotificationsApi()

			setLoading(false)
		}
	
		fetchApis()
	}, [fetchGetNotificationsApi])

  useEffect(() => {
    const handleMessage = async (e) => {
      const { type } = e.data
      if (type === 'PUSH_NOTIFICATION_RECEIVED') {
				await fetchGetNotificationsApi()
      }
    }

    navigator.serviceWorker.addEventListener('message', handleMessage)

    return () => {
      navigator.serviceWorker.removeEventListener('message', handleMessage)
    }
  }, [fetchGetNotificationsApi])

  // change the notifications data when the api loads
	useEffect(() => {
			if (getNotificationsApiData?.record) {
				setNotifications(getNotificationsApiData.record.notifications.slice().reverse().slice(0, 30))
			}
	}, [getNotificationsApiData])

  const getNotificationDay = (date) => {
    if (isToday(date)) {
        return `today, at ${format(date, 'h:mm a').replace('AM', 'am').replace('PM', 'pm')}`;
    } else if (isYesterday(date)) {
        return `yesterday, at ${format(date, 'h:mm a').replace('AM', 'am').replace('PM', 'pm')}`;
    } else {
        return `${format(date, "EEE',' 'at' h:mm a").replace('AM', 'am').replace('PM', 'pm')}`;
    }
  }

  if (loading) {
    return (
      <div />
    )
  }
  
  if (getNotificationsApiError) {
		console.log(getNotificationsApiError)
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