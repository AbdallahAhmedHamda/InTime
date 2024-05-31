import { useDispatch } from 'react-redux'
import { setCurrentPage, removeAllPopups } from '../features/navigation/navigationSlice'
import { useEffect } from 'react'
import CalendarView from '../components/calendar/CalendarView'
import '../css/pages/Calendar.css'

export default function Calendar() {
  const dispatch = useDispatch()

  // change the current page so the app can rerender and update sidenav active icon and remove all popups
  useEffect(() => {
    dispatch(setCurrentPage('calendar'))
    dispatch(removeAllPopups())
  }, [dispatch])

  return (
    <div className='main-content'>
      <CalendarView />
    </div>
  )
}