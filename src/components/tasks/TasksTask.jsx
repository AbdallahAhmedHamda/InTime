import { useDispatch } from 'react-redux'
import { addPopup, setCurrentTask } from '../../features/navigation/navigationSlice'
import { useState } from 'react'
import { format } from 'date-fns'
import TasksTaskDeleteIcon from '../../svg/tasks/TasksTaskDeleteIcon'
import TasksTaskGroupIcon from '../../svg/tasks/TasksTaskGroupIcon'
import TasksTaskStepsIcon from '../../svg/tasks/TasksTaskStepsIcon'
import TasksTaskEditIcon from '../../svg/tasks/TasksTaskEditIcon'

export default function TasksTask({ task }) {
  const dispatch = useDispatch()

  const [image, setImage] = useState(task.image)

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
    backgroundColor: task?.tag?.name ? task.tag.color : '#585A66'
  }

  const startDate = new Date(task.startAt).setHours(0, 0, 0, 0)
  const endDate = new Date(task.endAt).setHours(0, 0, 0, 0)

  return (
    <div className='tasks-task-container' onClick={openTaskPreview}>
      { 
        (task?.tag?.name || task?.projectId) && (
          <div className='tasks-task-upper-section'>
            {
              task?.tag?.name && <p style={tagStyles}>{task.tag.name}</p>
            }

            {
              task?.projectId && <TasksTaskGroupIcon />
            }
          </div>
        )
      }


      <div className='tasks-task-middle-section'>
        {
        image && (
            <img
              className='tasks-task-cover-image'
              src={`https://intime-9hga.onrender.com/api/v1/images/${task.image}`}
              alt='cover' 
              onError={(e) => {
                e.target.onerror = null
                setImage('')
              }}
            />
          )
        }

        <p className='tasks-task-title'>{task.name}</p>

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

          {
            !task.completed ? <TasksTaskEditIcon editTask={editTask}/> : ''
          }
        </div>

        { 
          task.steps.length !== 0 && (
            <div className='tasks-task-steps-container'>
              <TasksTaskStepsIcon />

              <p className='tasks-task-steps'>
                {
                  task.steps.filter((step) => step.completed).length + '/' + task.steps.length
                }
              </p>
            </div>
          )
        }
      </div>
    </div>
  )
}