import { useDispatch, useSelector } from 'react-redux'
import { addPopup, setCurrentTask, setCurrentProject } from '../../features/navigation/navigationSlice'
import { format } from 'date-fns'

export default function ProjectTask({ task, project, user }) {
  const myId = useSelector((state) => state.user.id)
  const dispatch = useDispatch()

  const openTaskPreview = () => {
    if (myId === project.members.find((projectMember) => projectMember.role === 'admin')?.memberId) {
      dispatch(addPopup('admin task preview'))
      dispatch(setCurrentTask(task))
      dispatch(setCurrentProject(project))
    } else {
      dispatch(addPopup('task preview'))
      dispatch(setCurrentTask(task))
    }
  }

  const tagStyles = {
    backgroundColor: task?.tag?.name ? task.tag.color : '#585A66'
  }

  const projectTaskStyles = {
    borderColor: 
      task.completed
        ? '#00FF29'
        : new Date(task.startAt) > new Date()
        ? '#5468E7'
        : '#585A66'
  }

  const endDate = new Date(task.endAt).setHours(0, 0, 0, 0)
  return (
    <div className='project-page-single-task-container' onClick={openTaskPreview} style={projectTaskStyles}>
      <div className='project-page-single-task-upper-section'>
        <div className='project-page-single-task-upper-left-section'>
          {
            task?.tag?.name && <p style={tagStyles} className='project-page-single-task-tag'>{task.tag.name}</p>
          }

          <p className='project-page-single-task-date'>
            {`End date ${format(endDate, "d MMM 'at' h a").replace('AM', 'am').replace('PM', 'pm')}`}
          </p>
        </div>

        <div className='project-page-single-task-upper-right-section'>
          <img
            src={`https://intime-9hga.onrender.com/api/v1/images/${user.avatar}`}
            alt='profile-pic'
            className='project-page-single-task-member-profile-pic'
            onError={(e) => {
              e.target.onerror = null
              e.target.src = require('../../assets/images/profile-pic.jpeg')
            }}
          />

          <p className='project-page-single-task-member-name'>{user.name}</p>
        </div>
      </div>

      <p className='project-page-single-task-title'>{task.name}</p>

      <div className='project-page-single-task-bottom-section'>
        {
          myId === task.userId && (
            <div className='project-page-single-task-your-task'>
              Your Task
            </div>
          )
        }

{
          task.completed ? (
            <div className='project-page-single-task-state-finished'>
              Finished
            </div>
          ) :
          new Date(task.startAt) > new Date() ? (
            <div className='project-page-single-task-state-waiting'>
              Waiting for start
            </div>
          ) : (
            <div className='project-page-single-task-state-in-progress'>
              In progress
            </div>
          )
        }
      </div>
    </div>
  )
}