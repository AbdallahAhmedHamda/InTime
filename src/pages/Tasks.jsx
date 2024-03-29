import { useSelector, useDispatch } from 'react-redux'
import { setCurrentPage, removeAllPopups, setTasksToShow } from '../features/navigation/navigationSlice'
import { useEffect, useState } from 'react'
import TasksTask from '../components/tasks/TasksTask'
import Filters from '../components/tasks/Filters'
import TasksShowMoreArrow from'../svg/tasks/TasksShowMoreArrow'
import '../css/pages/Tasks.css'

export default function Tasks() {
  const tasks = useSelector((state) => state.user.tasks)
  const tasksToShow = useSelector((state) => state.navigation.tasksToShow)

  const dispatch = useDispatch()

  const [showMoreHovered, setShowMoreHovered] = useState(false)
  const [showLessHovered, setShowLessHovered] = useState(false)

  // change the current page so the app can rerender and update sidenav active icon and remove all popups
  useEffect(() => {
    dispatch(setCurrentPage('tasks'))
    dispatch(removeAllPopups())
    // eslint-disable-next-line
  }, [])

  // add tasks to the filters if there is space for them
  useEffect(() => {
    if (tasks.length <= 9 || tasksToShow % 3 !== 0 || tasksToShow > tasks.length) {
      dispatch(setTasksToShow(tasks.length))
    }
    // eslint-disable-next-line
  }, [tasks])

  const showMore = () => {
    if (Math.floor(tasks.length / 9) === Math.floor(tasksToShow / 9)) {
      dispatch(setTasksToShow(tasksToShow + (tasks.length - tasksToShow)))
    } else {
      dispatch(setTasksToShow(tasksToShow + 9))
    }
  }

  const showLess = () => {
    if (tasks.length === tasksToShow) {
      dispatch(setTasksToShow(tasksToShow - (tasksToShow % 9)))
    } else {
      dispatch(setTasksToShow(tasksToShow - 9))
    }
  }

  return (
    <div className='main-content'>
      <p className='page-name'>Tasks</p>

      <div className='tasks-container'>
        <div className='tasks-left-section'>
          <div className='tasks-left-section-tasks'>
            {
              tasks.slice(0, tasksToShow).map((task) => (
                <TasksTask task={task} key={task.id}/>
              ))
            }
          </div>

          {
            tasks !== 0 && (
              <div className='tasks-show-container'>
                {
                  tasksToShow > 9 && (
                    <div 
                      className='tasks-show-less'
                      onClick={showLess}
                      onMouseEnter={() => setShowLessHovered(true)}
                      onMouseLeave={() => setShowLessHovered(false)}
                    >
                      <p>Show less</p>

                      <TasksShowMoreArrow isHovered={showLessHovered}/>
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
            )
          }
        </div>

        <div className='tasks-right-section'>
          <Filters />
        </div>
      </div>
    </div>
  )
}