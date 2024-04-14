import { useDispatch } from 'react-redux'
import { setCurrentPage, removeAllPopups } from '../features/navigation/navigationSlice'
import { useEffect } from 'react'
import '../css/pages/Board.css'

export default function Board() {
  const dispatch = useDispatch()

  // change the current page so the app can rerender and update sidenav active icon and remove all popups
  useEffect(() => {
    dispatch(setCurrentPage('board'))
    dispatch(removeAllPopups())
    // eslint-disable-next-line
  }, [])

  return (
    <div className='main-content'>
      <p className='page-name'>Board</p>
    </div>
  )
}