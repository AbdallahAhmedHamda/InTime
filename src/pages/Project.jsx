// import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCurrentPage, removeAllPopups } from '../features/navigation/navigationSlice'
import { useEffect } from 'react'


export default function Project() {
  // const { projectId } = useParams()
  
  const dispatch = useDispatch()

  // change the current page so the app can rerender and update sidenav active icon and remove all popups
  useEffect(() => {
    dispatch(setCurrentPage('project'))
    dispatch(removeAllPopups())
  }, [dispatch])

  return (
    <div className='main-content'>
      <div className="board-header">
        <p className='page-name'>Project</p>
      </div>
    </div>
  )
}