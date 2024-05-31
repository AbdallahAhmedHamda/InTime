import { useSelector, useDispatch } from 'react-redux'
import { setCurrentPage, removeAllPopups, addPopup } from '../features/navigation/navigationSlice'
import { useEffect, useState } from 'react'
import TasksTask from '../components/tasks/TasksTask'
import Filters from '../components/tasks/Filters'
import Sorting from '../components/tasks/Sorting'
import TasksShowMoreArrow from'../svg/tasks/TasksShowMoreArrow'
import TasksShowLessArrow from'../svg/tasks/TasksShowLessArrow'
import AddTaskIcon from '../svg/board/AddTaskIcon'
import '../css/pages/Tasks.css'

export default function Tasks() {
  const tasks = useSelector((state) => state.user.tasks)

  const dispatch = useDispatch()

  const [showMoreHovered, setShowMoreHovered] = useState(false)
  const [showLessHovered, setShowLessHovered] = useState(false)
  const [tasksToShow, setTasksToShow] = useState(12)
  // change the current page so the app can rerender and update sidenav active icon and remove all popups
  useEffect(() => {
    dispatch(setCurrentPage('tasks'))
    dispatch(removeAllPopups())
  }, [dispatch])

  // add tasks to the filters if there is space for them
  useEffect(() => {
    if (tasks.length <= 12 || tasksToShow % 3 !== 0 || tasksToShow > tasks.length) {
      setTasksToShow(tasks.length)
    }
    // eslint-disable-next-line
  }, [tasks])

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
      console.log('here')
      setTasksToShow(tasksToShow - (tasksToShow % 12 === 0 ? 12 : tasksToShow % 12 ))
    } else {
      setTasksToShow(tasksToShow - 12)
    }

    setShowLessHovered(false)
  }

  return (
    <div className='main-content'>
      <div className='tasks-upper-section'>
        <p className='page-name'>Tasks</p>
        
        {
          tasks.length !== 0 && (
            <Sorting />
          )
        }
      </div>
      {
        tasks.length !== 0 ? 
        (
          <div className='tasks-container'>
            <div className='tasks-left-section'>
              <div className='tasks-left-section-tasks'>
                {
                  tasks.slice(0, tasksToShow).map((task) => (
                    <TasksTask task={task} key={task.id}/>
                  ))
                }
              </div>

              <div className='tasks-show-container'>
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
                  tasks.length !== tasksToShow && (
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
              <Filters />
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