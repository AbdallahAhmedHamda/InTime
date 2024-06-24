import { useSelector, useDispatch } from 'react-redux'
import { setRank, setTotalPoints, setLevel, setCompletedTasks, setInProgressTasks, setPoints, setTags } from '../features/user/userSlice'
import { setCurrentPage, removeAllPopups, addPopup, setActionDone, setAllRanks } from '../features/navigation/navigationSlice'
import { useEffect, useState } from 'react'
import { userDataApi, rankApi } from '../apis/userApi'
import { allTasksApi } from '../apis/tasksApi'
import useApi from '../hooks/useApi'
import { fillDaily, fillMonthly, fillYearly } from '../functions/pointsFunctions'
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
  const actionDone = useSelector((state) => state.navigation.actionDone)

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
  const [showMoreClicked, setShowMoreClicked] = useState(false)
  const [showLessHovered, setShowLessHovered] = useState(false)
  const [shownTasks, setShownTasks] = useState(0)
  const [nextPage, setNextPage] = useState(false)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState([])

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

  const {
    fetchApi : fetchUserDataApi,
    apiData: userDataApiData,
    apiError: userDataApiError,
  } = useApi(userDataApi)
  
  const {
    fetchApi : fetchRankApi,
    apiData: rankApiData,
    apiError: rankApiError,
  } = useApi(rankApi)
  
  const {
    fetchApi : fetchTagsApi,
    apiData: tagsApiData,
    apiError: tagsApiError,
  } = useApi(allTasksApi)

  // change the current page so the app can rerender and update sidenav active icon and remove all popups
  useEffect(() => {
    dispatch(setCurrentPage('tasks'))
    dispatch(removeAllPopups())
    
    setShownTasks(0)

    return () => {
      dispatch(setActionDone(''))
    }
  }, [dispatch])

  // change data when action is done
  useEffect(() => {
    const fetchApis = async () => {
      if (actionDone === 'add task' || actionDone === 'edit task' || actionDone === 'edit steps' || actionDone === 'complete task' || actionDone === 'remove task' || actionDone === 'member edit project task') {
        console.log(shownTasks)
        if (actionDone === 'add task') {
          await fetchAllTasksApi({
            page: 1,
            size: (shownTasks < 12 || shownTasks % 3 !== 0) ? shownTasks + 1 : shownTasks,
            ...sorting,
            ...filters
          })
        } else {
          await fetchAllTasksApi({
            page: 1,
            size: shownTasks,
            ...sorting,
            ...filters
          })
        }

        if (actionDone === 'add task' || actionDone === 'complete task' || actionDone === 'remove task' || actionDone === 'member edit project task') {
          await fetchUserDataApi()
        }

        if (actionDone === 'add task' || actionDone === 'edit task' || actionDone === 'remove task') {
          await fetchTagsApi({
            page: 1,
            size: 0,
            sortingType: 1
          })
        }

        if (actionDone === 'complete task') {
          await fetchRankApi()
        }

        dispatch(setActionDone(''))
      }
    }
  
    fetchApis()
    // eslint-disable-next-line
  }, [actionDone, fetchAllTasksApi, fetchRankApi, fetchTagsApi, fetchUserDataApi, dispatch])

  // change the account data when the api loads
  useEffect(() => {
    if (userDataApiData?.success) {
      const filledDaily = fillDaily(userDataApiData.record.points.daily)
      const filledMonthly = fillMonthly(userDataApiData.record.points.monthly)
      const filledYearly = fillYearly(userDataApiData.record.points.yearly)
      dispatch(setTotalPoints(
        {
          overall: userDataApiData.record.points.totalPoints,
          thisMonth: filledMonthly.points[filledMonthly.points.length - 1],
          lastMonth: filledMonthly.points[filledMonthly.points.length - 2]
        }
      ))
      dispatch(setPoints(
        {
          daily: filledDaily,
          monthly: filledMonthly,
          yearly: filledYearly
        }
      ))
      dispatch(setLevel(Math.floor(userDataApiData.record.points.totalPoints / 100) + 1))
      dispatch(setCompletedTasks(userDataApiData.record.tasks.completedTasks))
      dispatch(setInProgressTasks(userDataApiData.record.tasks.onGoingTasks))
    }
  }, [userDataApiData, dispatch]) 

  // change the ranks data when the api loads
  useEffect(() => {
    if (rankApiData) {
      dispatch(setRank(rankApiData.myRank + 1))
      dispatch(setAllRanks(rankApiData.rankedUser))
    }
  }, [rankApiData, dispatch])

  // change the tags data when the api loads
  useEffect(() => {
    if (tagsApiData) {
      dispatch(setTags(
        tagsApiData.tags
          .filter((item) => item.name.trim() !== '')
          .filter((item, index, self) =>
            index === self.findIndex((t) => (
              t.name.trim().toLowerCase() === item.name.trim().toLowerCase()
            ))
          )
      ))
    }
  }, [tagsApiData, dispatch])

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
      if (showMoreClicked) {
        setTasks((prevTasks) => [...prevTasks, ...allTasksApiData.record])

        setShownTasks([...tasks, ...allTasksApiData.record].length)

        setShowMoreClicked(false)
      } else {
        setTasks(allTasksApiData.record)
        
        setShownTasks(allTasksApiData.record.length)
      }

      setNextPage(allTasksApiData?.nextPage)
    }
    // eslint-disable-next-line
	}, [allTasksApiData])

  // fetch filtered tasks api data
	useEffect(() => {
    if (filtersApiData?.record) {
      if (showMoreClicked) {
        setTasks((prevTasks) => [...prevTasks, ...filtersApiData.record])

        setShownTasks([...tasks, ...filtersApiData.record].length)

        setShowMoreClicked(false)
      } else {
        setTasks(filtersApiData.record)

        setShownTasks(filtersApiData.record.length)
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

      setShowMoreClicked(true)
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

  if (userDataApiError) {
    console.log(userDataApiError)
  }
  
  if (rankApiError) {
    console.log(rankApiError)
  }
  
  if (tagsApiError) {
    console.log(tagsApiError)
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