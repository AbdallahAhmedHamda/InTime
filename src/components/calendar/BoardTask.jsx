import { useDispatch } from 'react-redux'
import { addPopup, setCurrentTask } from '../../features/navigation/navigationSlice'
import { format } from 'date-fns'
import TasksTaskGroupIcon from '../../svg/tasks/TasksTaskGroupIcon'
import TasksTaskStepsIcon from '../../svg/tasks/TasksTaskStepsIcon'

export default function BoardTask({ task, calendarDate }) {
  const dispatch = useDispatch()

  const openTaskPreview = () => {
    dispatch(addPopup('task preview'))
    dispatch(setCurrentTask(task))
  }

  const tagStyles = {
    backgroundColor: task.tag.color
  }

  const startDate = new Date(task.startDate).setHours(0, 0, 0, 0)
  const endDate = new Date(task.endDate).setHours(0, 0, 0, 0)
  const thisDate = new Date(calendarDate).setHours(0, 0, 0, 0)

  return (
    <div className='board-task-container' onClick={openTaskPreview}>
      <div className='board-task-upper-section'>
        {
          startDate === endDate ?
          <p className='board-task-date'>
            {format(new Date(task.startDate), "h':'mm a")}  - {format(new Date(task.endDate), "h':'mm a")}
          </p> :
          thisDate === startDate ?
          <p className='board-task-date'>
            {format(new Date(task.startDate), "h':'mm a")} 

            <span>Start</span>
          </p> :
          <p className='board-task-date'>
            {format(new Date(task.endDate), "h':'mm a")}  

            <span>End</span>
          </p>
        }

        {
          task.creator !== 'me' && <TasksTaskGroupIcon />
        }
      </div>

      <div className='board-task-middle-section'>
        {
        task.image && (
            <img
              className='board-task-cover-image'
              src={task.image}
              alt='cover' 
            />
          )
        }

        <p className='board-task-title'>{task.title}</p>
      </div>

      <div className='board-task-bottom-section'>
        <p style={tagStyles}>{task.tag.name}</p>


        { 
          task.steps.length !== 0 && (
            <div className='board-task-steps-container'>
              <TasksTaskStepsIcon />

              <p className='board-task-steps'>
                {
                  task.steps.filter((setp) => setp.isCompleted).length + '/' + task.steps.length
                }
              </p>
            </div>
          )
        }
      </div>
    </div>
  )
}