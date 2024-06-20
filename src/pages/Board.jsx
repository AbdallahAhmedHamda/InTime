import { Link, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCurrentPage, removeAllPopups, addPopup } from '../features/navigation/navigationSlice'
import { useEffect, useState } from 'react'
import { allTasksApi } from '../apis/tasksApi'
import useApi from '../hooks/useApi'
import PrevMonthIcon from '../svg/board/PrevMonthIcon'
import NextMonthIcon from '../svg/board/NextMonthIcon'
import AddTaskIcon from '../svg/board/AddTaskIcon'
import '../css/pages/Board.css'
import BoardTask from '../components/calendar/BoardTask'


export default function Board() {
  const { stringDate } = useParams()
  
  const dispatch = useDispatch()

  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  const {
		fetchApi : fetchAllTasksApi,
		apiData: allTasksApiData,
		apiError: allTasksApiError,
	} = useApi(allTasksApi)

  // change the current page so the app can rerender and update sidenav active icon and remove all popups
  useEffect(() => {
    dispatch(setCurrentPage('board'))
    dispatch(removeAllPopups())
  }, [dispatch])

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