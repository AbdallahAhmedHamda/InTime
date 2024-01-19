import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setCurrentPage } from '../features/navigation/navigationSlice'
import '../CSS/Pages/Calendar.css'

export default function Calendar() {
  const dispatch = useDispatch()

  // change the current page so the app can rerender and update sidenav active icon
  useEffect(() => {
    dispatch(setCurrentPage('calendar'))
  }, [dispatch])

  return (
    <div>
      <p className='page-names'>Calendar</p>
    </div>
  )
}