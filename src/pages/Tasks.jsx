import { useDispatch } from 'react-redux'
import { setCurrentPage, removeAllPopups } from '../features/navigation/navigationSlice'
import { useEffect } from 'react'
import Filters from '../components/tasks/Filters'
import '../css/pages/Tasks.css'

export default function Tasks() {
  const dispatch = useDispatch()

  // change the current page so the app can rerender and update sidenav active icon and remove all popups
  useEffect(() => {
    dispatch(setCurrentPage('tasks'))
    dispatch(removeAllPopups())
    // eslint-disable-next-line
  }, [])

  return (
    <div className='main-content'>
      <p className='page-name'>Tasks</p>

      <div className='tasks-container'>
        <div className='tasks-left-section'>

        </div>

        <div className='tasks-right-section'>
          <Filters />
        </div>
      </div>
    </div>
  )
}