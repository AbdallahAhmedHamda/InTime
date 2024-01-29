import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setCurrentPage, setCurrentPopup } from '../features/navigation/navigationSlice'
import '../css/pages/Home.css'
import Progress from '../components/home/Progress'
import ProgressGraph from '../components/home/ProgressGraph'
import ProgressBar from '../components/home/ProgressBar'
import Leaderboard from '../components/home/Leaderboard'

export default function Home() {
  const dispatch = useDispatch()

  // change the current page so the app can rerender and update sidenav active icon
  useEffect(() => {
    dispatch(setCurrentPage(''))
    dispatch(setCurrentPopup(''))
  }, [dispatch])

  return (
    <div>
      <p className='page-name'>Home</p>

      <div className='home-container'>
        <div>
          <Progress />
          
          <ProgressGraph />
        </div>

        <div className="home-right-section">
          <ProgressBar />
          <Leaderboard />
        </div>
      </div>

      
    </div>
  )
}