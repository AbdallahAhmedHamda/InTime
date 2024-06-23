import { useDispatch } from 'react-redux'
import { addPopup, setCurrentTask } from '../../features/navigation/navigationSlice'
import { useState } from 'react'
import { format } from 'date-fns'
import TasksTaskGroupIcon from '../../svg/tasks/TasksTaskGroupIcon'
import TasksTaskStepsIcon from '../../svg/tasks/TasksTaskStepsIcon'

export default function BoardTask({ task, calendarDate }) {
  const dispatch = useDispatch()

  const [image, setImage] = useState(task.image)

  const openTaskPreview = () => {
    dispatch(addPopup('task preview'))
    dispatch(setCurrentTask(task))
  }

  const tagStyles = {
    backgroundColor: task?.tag?.name ? task.tag.color : '#585A66'
  }

  const startDate = new Date(task.startAt).setHours(0, 0, 0, 0)
  const endDate = new Date(task.endAt).setHours(0, 0, 0, 0)
  const thisDate = new Date(calendarDate).setHours(0, 0, 0, 0)

  return (
    <div className='board-task-container' onClick={openTaskPreview}  style={{ outline: task.completed ? '2px solid #00FF29' : 'none'}}>
      <div className='board-task-upper-section'>
        {
          startDate === endDate ?
          <p className='board-task-date'>
            {format(new Date(task.startAt), "h':'mm a")}  - {format(new Date(task.endAt), "h':'mm a")}
          </p> :
          thisDate === startDate ?
          <p className='board-task-date'>
            {format(new Date(task.startAt), "h':'mm a")} 

            <span>Start</span>
          </p> :
          <p className='board-task-date'>
            {format(new Date(task.endAt), "h':'mm a")}  

            <span>End</span>
          </p>
        }

        {
          task?.projectId && <TasksTaskGroupIcon />
        }
      </div>

      <div className='board-task-middle-section'>
        {
        image && (
            <img
              className='board-task-cover-image'
              src={`https://intime-9hga.onrender.com/api/v1/images/${task.image}`}
              alt='cover'
              onError={(e) => {
                e.target.onerror = null
                setImage('')
              }}
            />
          )
        }

        <p className='board-task-title'>{task.name}</p>
      </div>

      {
        (task?.tag?.name || task?.steps.length !== 0) && (
          <div className='board-task-bottom-section'>
            {
              task?.tag?.name && <p style={tagStyles}>{task.tag.name}</p>
            }


            { 
              task?.steps.length !== 0 && (
                <div className='board-task-steps-container'>
                  <TasksTaskStepsIcon />

                  <p className='board-task-steps'>
                    {
                      task.steps.filter((step) => step.completed).length + '/' + task.steps.length
                    }
                  </p>
                </div>
              )
            }
          </div>
        )
      }
    </div>
  )
}