import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setCurrentPage, setCurrentPopup } from '../features/navigation/navigationSlice'
import '../css/pages/Calendar.css'

export default function Calendar() {
  const dispatch = useDispatch()

  // change the current page so the app can rerender and update sidenav active icon
  useEffect(() => {
    dispatch(setCurrentPage('calendar'))
    dispatch(setCurrentPopup(''))
  }, [dispatch])

  return (
    <div>
      <p className='page-name'>Calendar</p>
    </div>
  )
}