import { useDispatch } from 'react-redux'
import { setCurrentPage, removeAllPopups, addPopup } from '../features/navigation/navigationSlice'
import { useEffect, useState } from 'react'
import { allTasksApi } from '../apis/tasksApi'
import useApi from '../hooks/useApi'
import ProgressGraph from '../components/home/ProgressGraph'
import Leaderboard from '../components/home/Leaderboard'
import ProgressBar from '../components/home/ProgressBar'
import Progress from '../components/home/Progress'
import HomeTask from '../components/home/HomeTask'
import PlusIcon from '../svg/home/PlusIcon'
import '../css/pages/Home.css'

export default function Home() {

  const dispatch = useDispatch()

  const [orderedTasks, setOrderedTasks] = useState([])
  const [loading, setLoading] = useState(true)

  const {
		fetchApi : fetchAllTasksApi,
		apiData: allTasksApiData,
		apiError: allTasksApiError,
	} = useApi(allTasksApi)

  // change the current page so the app can rerender and update sidenav active icon and remove all popups
  useEffect(() => {
    dispatch(setCurrentPage('home'))
    dispatch(removeAllPopups())
  }, [dispatch])

  // load tasks
	useEffect(() => {
		const fetchApis = async () => {	
      await fetchAllTasksApi({
        page: 1,
        size: 2,
        sortingType: -1,
        sortBy: 'createdAt',
        completed: false
      })

			setLoading(false)
		}
	
		fetchApis()
	}, [fetchAllTasksApi])

  // fetch api data
	useEffect(() => {
    if (allTasksApiData?.record) {
      setOrderedTasks(allTasksApiData.record)
    }

	}, [allTasksApiData])

  if (loading) {
    return (
      <div />
    )
  }

  if (allTasksApiError) {
    console.log(allTasksApiError)
  }

  return (
    <div className='main-content'>
      <p className='page-name'>Home</p>

      <div className='home-container'>
        <div className='home-left-section'>
          <Progress />
          
          <ProgressGraph />

          <p>Recent Tasks</p>

          <div className='home-bottom-section'>
            <div className='home-recent-tasks'>
              {
                orderedTasks.map((task) => (
                  <HomeTask task={task} key={task._id}/>
                ))
              }
            </div>

            <div className='home-button-wrapper'>
              <button
                className='home-add-task-button'
                onClick={() => dispatch(addPopup('add'))}
              >
                <PlusIcon color='#5468E7'/>

                Task
              </button>

              <button
                className='home-add-project-button'
                onClick={() => dispatch(addPopup('add project'))}
              >
                <PlusIcon color='#F48C06'/>

                Project
              </button>
            </div>
          </div>
        </div>

        <div className='home-right-section'>
          <ProgressBar />

          <Leaderboard />
        </div>
      </div>

    </div>
  )
}