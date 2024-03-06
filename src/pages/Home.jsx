import { useDispatch, useSelector } from 'react-redux'
import { setCurrentPage, removeAllPopups, addPopup } from '../features/navigation/navigationSlice'
import { useEffect } from 'react'
import ProgressGraph from '../components/home/ProgressGraph'
import Leaderboard from '../components/home/Leaderboard'
import ProgressBar from '../components/home/ProgressBar'
import Progress from '../components/home/Progress'
import HomeTask from '../components/home/HomeTask'
import PlusIcon from '../svg/home/PlusIcon'
import '../css/pages/Home.css'

export default function Home() {
  const tasks = useSelector((state) => state.tasks.tasks)
  
  const dispatch = useDispatch()

  // change the current page so the app can rerender and update sidenav active icon
  useEffect(() => {
    dispatch(setCurrentPage(''))
    dispatch(removeAllPopups())
  }, [dispatch])

  const orderedTasks = 
    [...tasks]
      .filter((task) => !task.isCompleted)
      .sort((a, b) => {
        const aCreatedAt = new Date(a.createdAt)
        const bCreatedAt = new Date(b.createdAt)

        if (aCreatedAt > bCreatedAt) return -1
        if (aCreatedAt < bCreatedAt) return 1

        return 0
      })
      .slice(0, 2)

  return (
    <div>
      <p className='page-name'>Home</p>

      <div className='home-container'>
        <div>
          <Progress />
          
          <ProgressGraph />

          <p>Recent Tasks</p>

          <div className='home-bottom-section'>
            <div className='home-recent-tasks'>
              {
                orderedTasks.map((task, i) => (
                  <HomeTask task={task} key={task.id}/>
                ))
              }
            </div>

            <div className='home-button-wrapper'>
              <button
                className='home-add-task-button'
                onClick={() => dispatch(addPopup('add'))}
              >
                <PlusIcon color="#5468E7"/>

                Task
              </button>

              <button className='home-add-project-button'>
                <PlusIcon color="#F48C06"/>

                Project
              </button>
            </div>
          </div>
        </div>

        <div className="home-right-section">
          <ProgressBar />

          <Leaderboard />
        </div>
      </div>

    </div>
  )
}