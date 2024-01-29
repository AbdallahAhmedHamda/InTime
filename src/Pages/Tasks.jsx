import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setCurrentPage, setCurrentPopup } from '../features/navigation/navigationSlice'
import '../CSS/Pages/Tasks.css'

export default function Tasks() {
  const dispatch = useDispatch()

  // change the current page so the app can rerender and update sidenav active icon
  useEffect(() => {
    dispatch(setCurrentPage('tasks'))
    dispatch(setCurrentPopup(''))
  }, [dispatch])

  return (
    <div>
      <p className='page-name'>Tasks</p>
    </div>
  )
}