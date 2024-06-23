import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setRank, setTotalPoints, setLevel, setCompletedTasks, setInProgressTasks, setPoints, setTags } from '../features/user/userSlice'
import { setCurrentPage, removeAllPopups, addPopup, setActionDone, setAllRanks } from '../features/navigation/navigationSlice'
import { useEffect, useState } from 'react'
import { userDataApi, rankApi } from '../apis/userApi'
import { allTasksApi } from '../apis/tasksApi'
import useApi from '../hooks/useApi'
import { fillDaily, fillMonthly, fillYearly } from '../functions/pointsFunctions'
import PrevMonthIcon from '../svg/board/PrevMonthIcon'
import NextMonthIcon from '../svg/board/NextMonthIcon'
import AddTaskIcon from '../svg/board/AddTaskIcon'
import '../css/pages/Board.css'
import BoardTask from '../components/calendar/BoardTask'

export default function Board() {
  const actionDone = useSelector((state) => state.navigation.actionDone)

  const { stringDate } = useParams()
  
  const dispatch = useDispatch()

  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  const {
		fetchApi : fetchAllTasksApi,
		apiData: allTasksApiData,
		apiError: allTasksApiError,
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
    dispatch(setCurrentPage('board'))
    dispatch(removeAllPopups())

    return () => {
      dispatch(setActionDone(''))
    }
  }, [dispatch])
  
  // change data when action is done
  useEffect(() => {
    const fetchApis = async () => {
      if (actionDone === 'add task' || actionDone === 'edit task' || actionDone === 'edit steps' || actionDone === 'complete task' || actionDone === 'remove task' || actionDone === 'member edit project task') {
        await fetchAllTasksApi({
          sortingType: -1,
          sortBy: 'createdAt'
        })

        if (actionDone === 'add task' || actionDone === 'complete task' || actionDone === 'remove task') {
          await fetchUserDataApi()
        }

        if (actionDone === 'add task' || actionDone === 'edit task' || actionDone === 'remove task' || actionDone === 'member edit project task') {
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
        sortingType: -1,
        sortBy: 'createdAt'
      })

      setLoading(false)
		}
	
		fetchApis()
	}, [fetchAllTasksApi])

  // fetch api data
	useEffect(() => {
    if (allTasksApiData?.record) {
      setTasks(allTasksApiData.record)
    }

	}, [allTasksApiData])

  const monthTitle = () => {
    const options = { month: 'long', day: 'numeric', year: 'numeric' }
    return new Date(stringDate).toLocaleDateString('en-US', options)
  }

  const getClickedDay = (type) => {
    let date = new Date(stringDate)

    if (type === 'next') {
      date.setDate(date.getDate() + 1)

      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    } else if (type === 'prev') {
      date.setDate(date.getDate() - 1)

      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    } else if (type === 'today') {
      date = new Date()
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    }
  }
 
  const thisDay = new Date(stringDate).setHours(0, 0, 0, 0)
  const tasksInDay = tasks
    .map((task) => {
      const taskStartDay = new Date(task.startAt).setHours(0, 0, 0, 0)
      const taskEndDay = new Date(task.endAt).setHours(0, 0, 0, 0)

      if (thisDay === taskStartDay || thisDay === taskEndDay) { 
        return task
      }
      return null
    })
    .filter((task) => task !== null)

  if (loading) {
    return (
      <div />
    )
  }

  if (allTasksApiError) {
    console.log(allTasksApiError)
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
      <div className="board-header">
        <p className='page-name'>Board</p>
        <div className='board-buttons'>
          <Link
            to={`/calendar/${getClickedDay('today')}`}
            replace={true}
            className='board-today-button'
          >
            Today
          </Link>

          <Link
            to={`/calendar/${getClickedDay('prev')}`}
            replace={true}
          >
            <PrevMonthIcon/>
          </Link>

          <p>{monthTitle()}</p>

          <Link
            to={`/calendar/${getClickedDay('next')}`}
            replace={true}
          >
            <NextMonthIcon/>
          </Link>
        </div>
      </div>


      <div className='board-tasks-container'>
        {
          tasksInDay.length !== 0 ?
          tasksInDay.map((task) => (
            <BoardTask task={task} calendarDate={stringDate} key={task._id} />
          )) :
          <p>There is no Tasks</p>
        }

        <div className='board-svg-container'>
          <AddTaskIcon showPopup={() => dispatch(addPopup('add'))}/>
        </div>
      </div>
    </div>
  )
}