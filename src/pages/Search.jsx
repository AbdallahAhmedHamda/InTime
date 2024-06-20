import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCurrentPage, removeAllPopups } from '../features/navigation/navigationSlice'
import { useEffect, useState } from 'react'
import { searchTasksApi } from '../apis/tasksApi'
import useApi from '../hooks/useApi'
import TasksTask from '../components/tasks/TasksTask'
import TasksShowMoreArrow from'../svg/tasks/TasksShowMoreArrow'
import TasksShowLessArrow from'../svg/tasks/TasksShowLessArrow'
import '../css/pages/Tasks.css'

export default function Search() {
  const { searchValue } = useParams()

  const dispatch = useDispatch()

  const [showMoreHovered, setShowMoreHovered] = useState(false)
  const [showLessHovered, setShowLessHovered] = useState(false)
  const [tasksToShow, setTasksToShow] = useState(12)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  const {
		fetchApi : fetchSearchTasksApi,
		apiData: searchTasksApiData,
		apiError: searchTasksApiError,
	} = useApi(searchTasksApi)

  // change the current page so the app can rerender and update sidenav active icon and remove all popups
  useEffect(() => {
    dispatch(setCurrentPage('search'))
    dispatch(removeAllPopups())
  }, [dispatch])
  
  // load tasks
	useEffect(() => {
		const fetchApis = async () => {	
      await fetchSearchTasksApi(searchValue)

      setLoading(false)
		}
	
		fetchApis()
	}, [fetchSearchTasksApi, searchValue])

  // fetch api data
	useEffect(() => {
    if (searchTasksApiData?.record) {
      setTasks(searchTasksApiData.record.slice().reverse())
    }

	}, [searchTasksApiData])

  // add tasks to the filters if there is space for them
  useEffect(() => {
    if (tasks.length !== 0 && (tasks.length <= 12 || tasksToShow % 3 !== 0 || tasksToShow > tasks.length)) {
      setTasksToShow(tasks.length)
    }
    // eslint-disable-next-line
  }, [tasks, searchTasksApiData])
  
  const showMore = () => {
    if (Math.floor(tasks.length / 12) === Math.floor(tasksToShow / 12)) {
      setTasksToShow(tasksToShow + (tasks.length - tasksToShow))
    } else {
      setTasksToShow(tasksToShow + 12)
    }

    setShowMoreHovered(false)
  }

  const showLess = () => {
    if (tasks.length === tasksToShow) {
      setTasksToShow(tasksToShow - (tasksToShow % 12 === 0 ? 12 : tasksToShow % 12 ))
    } else {
      setTasksToShow(tasksToShow - 12)
    }

    setShowLessHovered(false)
  }

  if (loading) {
    return (
      <div />
    )
  }

  if (searchTasksApiError) {
    console.log(searchTasksApiError)
  }

  return (
    <div className='main-content'>
      <p className='page-name'>Search results</p>

      <div className='tasks-left-section search-page'>
          <div className='tasks-left-section-tasks'>
            {
              tasks.length !== 0 && (
                tasks.slice(0, tasksToShow).map((task) => (
                  <TasksTask task={task} key={task._id}/>
                ))
              )
            }
          </div>

          {
            tasks.length !== 0 && (
              <div className='tasks-show-container search-show'>
                {
                  tasksToShow > 12 && (
                    <div 
                      className='tasks-show-less'
                      onClick={showLess}
                      onMouseEnter={() => setShowLessHovered(true)}
                      onMouseLeave={() => setShowLessHovered(false)}
                    >
                      <p>Show less</p>

                      <TasksShowLessArrow isHovered={showLessHovered}/>
                    </div>
                  )
                }

                {
                  (tasks.length > 12 && tasks.length !== tasksToShow) && (
                    <div 
                      className='tasks-show-more'
                      onClick={showMore}
                      onMouseEnter={() => setShowMoreHovered(true)}
                      onMouseLeave={() => setShowMoreHovered(false)}
                    >
                      <p>Show more</p>

                      <TasksShowMoreArrow isHovered={showMoreHovered}/>
                    </div>
                  )
                }
              </div>
            )
          }
        </div>
    </div>
  )
}