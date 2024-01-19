import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setCurrentPage } from '../features/navigation/navigationSlice'
import '../CSS/Pages/Home.css'
import Progress from '../Components/Home/Progress'
import ProgressGraph from '../Components/Home/ProgressGraph'
import ProgressBar from '../Components/Home/ProgressBar'

export default function Home() {
  const dispatch = useDispatch()

  // change the current page so the app can rerender and update sidenav active icon
  useEffect(() => {
    dispatch(setCurrentPage(''))
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
        </div>
      </div>

      
    </div>
  )
}