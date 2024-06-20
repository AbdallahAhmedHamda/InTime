import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { allTasksApi } from '../../apis/tasksApi'
import useApi from '../../hooks/useApi'
import { format } from 'date-fns'
import PrevMonthIcon from '../../svg/calendar/PrevMonthIcon'
import NextMonthIcon from '../../svg/calendar/NextMonthIcon'
import CalendarGroupIcon from '../../svg/calendar/CalendarGroupIcon'
import '../../css//pages/Calendar.css'

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  const {
		fetchApi : fetchAllTasksApi,
		apiData: allTasksApiData,
		apiError: allTasksApiError,
	} = useApi(allTasksApi)

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


  const nextMonth = () => {
    const today = new Date()

    if (currentDate.getMonth() + 1 === today.getMonth() && currentDate.getFullYear() === today.getFullYear()) {
      setCurrentDate(today)
    } else {
      setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1))
    }
  }

  const prevMonth = () => {
    const today = new Date()

    if (currentDate.getMonth() - 1 === today.getMonth() && currentDate.getFullYear() === today.getFullYear()) {
      setCurrentDate(today)
    } else {
      setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1))
    }
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const monthTitle = () => {
    const options = { month: 'long', day: 'numeric', year: 'numeric' }
    return currentDate.toLocaleDateString('en-US', options)
  }

  const getMonthTasks = () => {
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    let Totaltasks = 0

    tasks.forEach((task) => {
      const endDate = new Date(task.endAt)
      const startDate = new Date(task.startAt)

      if(startDate < lastDayOfMonth && endDate > firstDayOfMonth && !task.completed && !task?.backlog) {
        Totaltasks += 1
      }
    })

    return Totaltasks
  }

  const perDayTasks = (date) => {
    const thisDay = date.setHours(0, 0, 0, 0)
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

    return (
      tasksInDay !== 0 ?
      <div className='calendar-day-tasks-container'>
        {
          tasksInDay.map((task, i) => {
            const taskStartDay = new Date(task.startAt).setHours(0, 0, 0, 0)
            const taskEndDay = new Date(task.endAt).setHours(0, 0, 0, 0)

            return (
              i < 2 ?
              <div style={{ backgroundColor: task?.tag?.name ? task.tag.color : '#585A66' }} className='calendar-task-container' key={i}>
                {
                  <p className='calendar-task-name'>{task.name}</p>
                }

                {
                  taskStartDay === taskEndDay ?
                  <div className='calendar-task-date'>
                    {format(new Date(task.startAt), "h':'mm a")}  - {format(new Date(task.endAt), "h':'mm a")}
                  </div> :
                  thisDay === taskStartDay ?
                  <div className='calendar-task-date'>
                    <p>
                      {format(new Date(task.startAt), "h':'mm a")} 
                    </p>

                    <span>Start</span>
                  </div> :
                  thisDay === taskEndDay ?
                  <div className='calendar-task-date'>
                    <p>
                      {format(new Date(task.endAt), "h':'mm a")}  
                    </p>

                    <span>End</span>
                  </div> :
                  ''
                }

                {
                  task?.projectId ?
                  <CalendarGroupIcon /> :
                  ''
                }
              </div> :
              ''
            )
          })
        }

        {
          tasksInDay.length > 2 ?
          <p className='calendar-more-tasks'>More Tasks +{tasksInDay.length - 2}</p> :
          ''
        }
      </div> :
      ''
    )
  }

  const returnDayNames = () => {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const currentDate = new Date()
    const currentDayIndex = currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1
  
    return daysOfWeek.map((day, index) => (
      <p key={index} className={index === currentDayIndex ? 'calendar-current-day-name' : ''}>{day}</p>
    ))
  }

  const renderDays = () => {
    const days = []
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const startingDayOfWeek = firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
    const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0)
    const nextMonthFirstDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    const currentDay = new Date().getDate()
    const totalDays = startingDayOfWeek + daysInMonth
    const remainingDays = totalDays > 35 ? 42 - totalDays : 35 - totalDays

    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), lastMonth.getDate() - i)
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

      days.push(
        <Link
          key={`prev-${startingDayOfWeek - i}`}
          to={`/calendar/${formattedDate}`}
          className="calendar-day calendar-prev-month"
        >
          <p>
            {
              date.toLocaleString('default', { month: 'short' })
            } { 
              date.getDate()
            }
          </p>

          {perDayTasks(date)}
        </Link>
      )
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i)
      const className = i === currentDay && new Date().getMonth() === date.getMonth() && new Date().getFullYear() === date.getFullYear() ? 'calendar-day calendar-current-day' : 'calendar-day'
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

      days.push(
        <Link
          key={`curr-${i}`}
          to={`/calendar/${formattedDate}`}
          className={`${className} ${7 - remainingDays > daysInMonth - i ? 'calendar-last-row' : ''} ${(i + startingDayOfWeek) % 7 === 0 ? 'calendar-last-column' : ''}`}
        >
          <p>
            {
              i === 1 ?
              `
                ${
                  date.toLocaleString('default', { month: 'short' })
                } ${
                  date.getDate()
                }
              `
              : i
            }
          </p>

          {perDayTasks(date)}
        </Link>
      )
    }

    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(nextMonthFirstDay.getFullYear(), nextMonthFirstDay.getMonth(), i)
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

      days.push(
        <Link
          key={`next-${i}`}
          to={`/calendar/${formattedDate}`}
          className={`calendar-day caledar-next-month calendar-last-row ${i === remainingDays ? 'calendar-last-column' : ''}`}
        >
          <p>
            {
              date.toLocaleString('default', { month: 'short' })
            } { 
              date.getDate()
            }
          </p>

          {perDayTasks(date)}
        </Link>
      )
    }

    return days
  }

  const styleFirstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const styleStartingDayOfWeek = styleFirstDayOfMonth.getDay() === 0 ? 6 : styleFirstDayOfMonth.getDay() - 1
  const styleDaysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const styleTotalDays = styleStartingDayOfWeek + styleDaysInMonth
  const daysStyles = {
    gridTemplateRows: styleTotalDays > 35 ? 'repeat(6, 1fr)' : 'repeat(5, 1fr)'
  }

  
  if (loading) {
    return (
      <div />
    )
  }

  if (allTasksApiError) {
		console.log(allTasksApiError)
	}
  
  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <p className='page-name'>Calendar</p>

        <p className='tasks-this-month'><span>Available tasks this month:</span> {getMonthTasks()}
        {
          getMonthTasks() !== 1 ? ' tasks' : ' task'
        }
        </p>
        <div className='calendar-buttons'>
          <button onClick={goToToday} className='calendar-today-button'>Today</button>

          <PrevMonthIcon onClick={prevMonth}/>

          <p>{monthTitle()}</p>

          <NextMonthIcon onClick={nextMonth}/>
        </div>
      </div>

      <div className='calendar-container'>
        <div className='calendar-days-names-container'>
          {returnDayNames()}
        </div>
        <div className="calendar-days" style={daysStyles}>
          {renderDays()}
        </div>
      </div>
    </div>
  )
}