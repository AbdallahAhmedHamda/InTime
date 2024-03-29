import { useDispatch } from 'react-redux'
import { addPopup, setCurrentTask } from '../../features/navigation/navigationSlice'
import { format } from 'date-fns'
import TasksTaskDeleteIcon from '../../svg/tasks/TasksTaskDeleteIcon'
import TasksTaskGroupIcon from '../../svg/tasks/TasksTaskGroupIcon'
import TasksTaskStepsIcon from '../../svg/tasks/TasksTaskStepsIcon'
import TasksTaskEditIcon from '../../svg/tasks/TasksTaskEditIcon'

export default function TasksTask({ task }) {
  const dispatch = useDispatch()

  const verifyDeletion = (e) => {
    e.stopPropagation()
    dispatch(addPopup('verify task deletion'))
    dispatch(setCurrentTask(task))
  }

  const editTask = (e) => {
    e.stopPropagation()
    dispatch(addPopup('edit'))
    dispatch(setCurrentTask(task))
  }

  const openTaskPreview = () => {
    dispatch(addPopup('task preview'))
    dispatch(setCurrentTask(task))
  }

  const tagStyles = {
    backgroundColor: task.tag.color
  }

  const startDate = new Date(task.startDate).setHours(0, 0, 0, 0)
  const endDate = new Date(task.endDate).setHours(0, 0, 0, 0)

  return (
    <div className='tasks-task-container' onClick={openTaskPreview}>
      <div className='tasks-task-upper-section'>
        <p style={tagStyles}>{task.tag.name}</p>

        {
          task.creator !== 'me' && <TasksTaskGroupIcon />
        }
      </div>

      <div className='tasks-task-middle-section'>
        {
        task.image && (
            <img
              className='tasks-task-cover-image'
              src={task.image}
              alt='cover' 
            />
          )
        }

        <p className='tasks-task-title'>{task.title}</p>

        {
          startDate === endDate ?
          <p className='tasks-task-date'>
            {format(startDate, "MMM d',' yyy")}
          </p> :
          <p className='tasks-task-date'>
            {format(startDate, "MMM d',' yyy")} - {format(endDate, "MMM d',' yyy")}
          </p>
        }
      </div>

      <div className='tasks-task-bottom-section'>
        <div className='tasks-task-button-container'>
          <TasksTaskDeleteIcon verifyDeletion={verifyDeletion}/>

          <TasksTaskEditIcon editTask={editTask}/>
        </div>

        { 
          task.steps.length !== 0 && (
            <div className='tasks-task-steps-container'>
              <TasksTaskStepsIcon />

              <p className='tasks-task-steps'>
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