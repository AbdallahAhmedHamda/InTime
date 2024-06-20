import { useDispatch, useSelector } from 'react-redux'
import { addPopup, setCurrentProject } from '../../features/navigation/navigationSlice'
import { useState } from 'react'
import DeleteProjectIcon from '../../svg/projects/DeleteProjectIcon'
import EditProjectIcon from '../../svg/projects/EditProjectIcon'
import AssignTaskIcon from '../../svg/projects/AssignTaskIcon'
import ChatIcon from '../../svg/projects/ChatIcon'

export default function ProjectsProject({ project }) {
  const userId = useSelector ((state) => state.user.id)

  const dispatch = useDispatch()

  const [image, setImage] = useState(project.photo)

  const openProjectPreview = () => {
    dispatch(addPopup('project preview'))
    dispatch(setCurrentProject(project))
  }

  const userRole = project.members.find((member) => userId === member.memberId)?.role || ''

  return (
    <div className='projects-project-container' onClick={openProjectPreview}>
      <div className='projects-project-upper-section'>
      <p className='projects-project-title'>{project.name}</p>

      <p className='projects-project-role'>
        {userRole}
      </p>
      </div>

      <div className='projects-project-middle-section'>
        {
        image && (
            <img
              className='projects-project-cover-image'
              src={`https://intime-9hga.onrender.com/api/v1/images/${project.photo}`}
              alt='cover'
              onError={(e) => {
                e.target.onerror = null
                setImage('')
              }}
            />
          )
        }
      </div>

      <div className='projects-project-bottom-section'>
        {
          userRole === 'admin' && (
            <div className='projects-project-left-bottom-section'>
              <DeleteProjectIcon openDeleteProject={(e) => {
                e.stopPropagation()
                dispatch(addPopup('verify project deletion'))
                dispatch(setCurrentProject(project))
              }}/>

              <EditProjectIcon openEditProject={(e) => {
                e.stopPropagation()
                dispatch(addPopup('edit project'))
                dispatch(setCurrentProject(project))
              }}/>

              <AssignTaskIcon />
            </div>
          )
        }

        <ChatIcon />
      </div>
    </div>
  )
}