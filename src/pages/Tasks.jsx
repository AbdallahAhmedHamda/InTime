import { useSelector, useDispatch } from 'react-redux'
import { setCurrentPage, removeAllPopups, addPopup } from '../features/navigation/navigationSlice'
import { useEffect, useState } from 'react'
import { allTasksApi } from '../apis/tasksApi'
import useApi from '../hooks/useApi'
import TasksTask from '../components/tasks/TasksTask'
import Filters from '../components/tasks/Filters'
import Sorting from '../components/tasks/Sorting'
import TasksShowMoreArrow from'../svg/tasks/TasksShowMoreArrow'
import TasksShowLessArrow from'../svg/tasks/TasksShowLessArrow'
import AddTaskIcon from '../svg/board/AddTaskIcon'
import '../css/pages/Tasks.css'

export default function Tasks() {
  const completedTasks = useSelector((state) => state.user.completedTasks)
  const inProgressTasks = useSelector((state) => state.user.inProgressTasks)

  const [filters, setFilters] = useState({
		projectTask: [],
    backlog: [],
		completed: [],
		priority: [],
		tag: []
	})
  const [sorting, setSorting] = useState({
		sortBy: 'createdAt',
		sortingType: '-1'
	})

  const dispatch = useDispatch()

  const [showMoreHovered, setShowMoreHovered] = useState(false)
  const [showLessHovered, setShowLessHovered] = useState(false)
  const [shownTasks, setShownTasks] = useState(0)
  const [nextPage, setNextPage] = useState(false)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  const {
		fetchApi: fetchAllTasksApi,
		apiData: allTasksApiData,
		apiError: allTasksApiError,
	} = useApi(allTasksApi)

  const {
		fetchApi: fetchFiltersApi,
		apiData: filtersApiData,
		apiError: filtersApiError,
		apiLoading: filtersApiLoading,
	} = useApi(allTasksApi)

  // change the current page so the app can rerender and update sidenav active icon and remove all popups
  useEffect(() => {
    dispatch(setCurrentPage('tasks'))
    dispatch(removeAllPopups())
    
    setShownTasks(0)
  }, [dispatch])

  // load tasks
	useEffect(() => {
    const fetchApis = async () => {	
      await fetchAllTasksApi({
        page: 1,
        size: 12,
        ...sorting,
        ...filters
      })

      setLoading(false)
    }
  
    fetchApis()
    // eslint-disable-next-line
	}, [fetchAllTasksApi])

  // fetch all tasks api data
	useEffect(() => {
    if (allTasksApiData?.record) {
      if (shownTasks === 0) {
        setTasks(allTasksApiData.record)
        
        setShownTasks(allTasksApiData.record.length)
      } else {
        setTasks((prevTasks) => [...prevTasks, ...allTasksApiData.record])

        setShownTasks([...tasks, ...allTasksApiData.record].length)
      }

      setNextPage(allTasksApiData?.nextPage)
    }
    // eslint-disable-next-line
	}, [allTasksApiData])


  // fetch filtered tasks api data
	useEffect(() => {
    if (filtersApiData?.record) {
      if (shownTasks === 0) {
        setTasks(filtersApiData.record)

        setShownTasks(filtersApiData.record.length)
      } else {
        setTasks((prevTasks) => [...prevTasks, ...filtersApiData.record])

        setShownTasks([...tasks, ...filtersApiData.record].length)
      }

      setNextPage(filtersApiData?.nextPage)
    }
    // eslint-disable-next-line
	}, [filtersApiData])

  
  const applyFilters = async () => {
    await fetchFiltersApi({
      page: 1,
      size: 12,
      ...sorting,
      ...filters
    })

    setShownTasks(0)
  }

  const showMore = async () => {
    setShowMoreHovered(false)

    if (shownTasks === tasks.length) {
      await fetchAllTasksApi({
        page: Math.ceil(shownTasks / 12) + 1,
        size: 12,
        ...sorting,
        ...filters
      })
    } else {
      if (Math.floor(tasks.length / 12) === Math.floor(shownTasks / 12)) {
        setShownTasks(shownTasks + (tasks.length - shownTasks))
      } else {
        setShownTasks(shownTasks + 12)
      }
    }
  }

  const showLess = () => {
    setShowLessHovered(false)

    setShownTasks(shownTasks - (shownTasks % 12 === 0 ? 12 : shownTasks % 12 ))
  }
  
  if (loading) {
    return (
      <div />
    )
  }

  if (allTasksApiError) {
    console.log(allTasksApiError)
  }

  if (filtersApiError) {
    console.log(filtersApiError)
  }

  return (
    <div className='main-content'>
      <div className='tasks-upper-section'>
        <p className='page-name'>Tasks</p>
        
        {
          completedTasks + inProgressTasks > 0 && (
            <Sorting
              sorting={sorting}
              setSorting={setSorting}
            />
          )
        }
      </div>
      {
        completedTasks + inProgressTasks > 0 ? 
        (
          <div className='tasks-container'>
            <div className='tasks-left-section'>
              <div className='tasks-left-section-tasks'>
                {
                  tasks.slice(0, shownTasks).map((task) => (
                    <TasksTask task={task} key={task._id}/>
                  ))
                }
              </div>

              <div className='tasks-show-container'>
                {
                  (tasks.length > 12 && shownTasks > 12) && (
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
                  (nextPage || tasks.length > shownTasks) && (
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
            </div>

            <div className='tasks-right-section'>
              <Filters
                filters={filters}
                setFilters={setFilters}
                applyFilters={applyFilters}
                disabled={filtersApiLoading}
              />
            </div>
          </div>
        ) : (
          <div className='tasks-no-tasks'>
            <p>There is no Tasks</p>
            <AddTaskIcon showPopup={() => dispatch(addPopup('add'))}/>
        </div>
        )
      }
    </div>
  )
}