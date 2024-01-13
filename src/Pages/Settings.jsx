import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setCurrentPage } from '../features/navigation/navigationSlice'
import '../CSS/Pages/Settings.css'

export default function Settings() {
  const dispatch = useDispatch()

  // change the current page so the app can rerender and update sidenav active icon
  useEffect(() => {
    dispatch(setCurrentPage('settings'))
  }, [])

  return (
    <div>
      <p className='page-name'>Settings</p>
    </div>
  )
}