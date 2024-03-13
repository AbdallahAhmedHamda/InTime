import { useDispatch } from 'react-redux'
import { setCurrentPage, removeAllPopups } from '../features/navigation/navigationSlice'
import { useEffect } from 'react'
import '../css/pages/Settings.css'

export default function Settings() {
  const dispatch = useDispatch()

  // change the current page so the app can rerender and update sidenav active icon and remove all popups
  useEffect(() => {
    dispatch(setCurrentPage('settings'))
    dispatch(removeAllPopups())
    // eslint-disable-next-line
  }, [])

  return (
    <div>
      <p className='page-name'>Settings</p>
    </div>
  )
}