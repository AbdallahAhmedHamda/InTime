import { useDispatch, useSelector } from 'react-redux'
import { removePopup, setCurrentTask } from '../../features/navigation/navigationSlice'
import { useRef, useEffect } from 'react'
import { useTransition, animated } from 'react-spring'
import VerifyProjectTaskDeletionMessage from '../popups/VerifyProjectTaskDeletionMessage'
import VerifyProjectDeletionMessage from '../popups/VerifyProjectDeletionMessage'
import VerifyAccountDeletionMessage from '../popups/VerifyAccountDeletionMessage'
import VerifyTaskCompletionMessage from '../popups/VerifyTaskCompletionMessage'
import VerifyTaskDeletionMessage from '../popups/VerifyTaskDeletionMessage'
import VerifyMemberRemovalMessage from '../popups/VerifyMemberRemovalMessage'
import AdminTaskPreview from '../popups/AdminTaskPreview'
import ProjectMembers from '../popups/ProjectMembers'
import MemberEditTask from '../popups/MemberEditTask'
import AdminEditTask from '../popups/AdminEditTask'
import JoinProject from '../popups/JoinProject'
import TaskPreview from '../popups/TaskPreview'
import EditProject from '../popups/EditProject'
import InviteLink from '../popups/InviteLink'
import AssignTask from '../popups/AssignTask'
import AddProject from '../popups/AddProject'
import ImageCrop from '../popups/ImageCrop'
import EditTask from '../popups/EditTask'
import AddTask from '../popups/AddTask'
import Message from '../popups/Message'

export default function Popups() {
  const popups = useSelector((state) => state.navigation.popups)
  const currentTask = useSelector((state) => state.navigation.currentTask)
  const currentInviteLink = useSelector((state) => state.navigation.currentInviteLink)
  const currentProject = useSelector((state) => state.navigation.currentProject)
  const currentMembers = useSelector((state) => state.navigation.currentMembers)
  const currentMember = useSelector((state) => state.navigation.currentMember)
  
  const dispatch = useDispatch()

  const popupsRef = useRef([])

  // disable page scrollbars when popus are active
  useEffect(() => {
    let reduxTimeout

    if (popups.length !== 0) {
      document.body.style.overflow = 'hidden'
    } else if (currentTask) {
      reduxTimeout = setTimeout(() => {
        dispatch(setCurrentTask(''))
      }, 300)
    }
    
    return () => {
      document.body.style.overflow = 'auto'
      clearTimeout(reduxTimeout)
    }
  }, [dispatch, currentTask, popups])

  // remove box shadow when there is x-overflow
  useEffect(() => {
    const checkOverflow = () => {
      popupsRef.current.forEach((popup) => {
        if (popup) {
          if (popup.scrollWidth > popup.clientWidth) {
            popup.classList.add('has-overflow')
          } else {
            popup.classList.remove('has-overflow')
          }
        }
      })
    }

    checkOverflow()

    window.addEventListener('resize', checkOverflow)

    return () => {
      window.removeEventListener('resize', checkOverflow)
    }
  }, [popups])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && popups.length !== 0) {
        dispatch(removePopup(popups[popups.length-1]))
      }
    }

    document.body.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.removeEventListener('keydown', handleKeyDown)
    }
  }, [dispatch, popups])
  
  const firstDimTransition = useTransition(popups[0], {
    from: { backgroundColor: 'rgba(0, 0, 0, 0)', pointerEvents: 'none' },
    enter: { backgroundColor: 'rgba(0, 0, 0, 0.3)', pointerEvents: 'auto' },
    leave: { backgroundColor: 'rgba(0, 0, 0, 0)', pointerEvents: 'none' },
    config: { duration: 300 }
  })
  
  const firstPopupTransition = useTransition(popups[0], {
    from: { opacity: 0, top: '40%', pointerEvents: 'none' },
    enter: { opacity: 1, top: '50%', pointerEvents: 'auto' },
    leave: { opacity: 0, top: '40%', pointerEvents: 'none' },
    config: { duration: 300 }
  })

  const secondDimTransition = useTransition(popups[1], {
    from: { backgroundColor: 'rgba(0, 0, 0, 0)', pointerEvents: 'none' },
    enter: { backgroundColor: 'rgba(0, 0, 0, 0.3)', pointerEvents: 'auto' },
    leave: { backgroundColor: 'rgba(0, 0, 0, 0)', pointerEvents: 'none' },
    config: { duration: 300 }
  })
  
  const secondPopupTransition = useTransition(popups[1], {
    from: { opacity: 0, top: '40%', pointerEvents: 'none' },
    enter: { opacity: 1, top: '50%', pointerEvents: 'auto' },
    leave: { opacity: 0, top: '40%', pointerEvents: 'none' },
    config: { duration: 300 }
  })

  const thirdDimTransition = useTransition(popups[2], {
    from: { backgroundColor: 'rgba(0, 0, 0, 0)', pointerEvents: 'none' },
    enter: { backgroundColor: 'rgba(0, 0, 0, 0.3)', pointerEvents: 'auto' },
    leave: { backgroundColor: 'rgba(0, 0, 0, 0)', pointerEvents: 'none' },
    config: { duration: 300 }
  })
  
  const thirdPopupTransition = useTransition(popups[2], {
    from: { opacity: 0, top: '40%', pointerEvents: 'none' },
    enter: { opacity: 1, top: '50%', pointerEvents: 'auto' },
    leave: { opacity: 0, top: '40%', pointerEvents: 'none' },
    config: { duration: 300 }
  })

  return (
    <>
			{/* first popup */}
			{
        firstDimTransition((style, item) => item && (
          <animated.div 
            className='dim-background no-select'
            style={{ ...style, zIndex: 100 }}
          />
        ))
      }

			{
        firstPopupTransition((style, item) => item && (
          <animated.div
            ref={(el) => (popupsRef.current[0] = el)}
            style={{ ...style, zIndex: 150 }}
            className='popup'
          >
            {
              item === 'add' ?
              <AddTask /> :
              item === 'add project' ?
              <AddProject /> :
              item === 'assign task' ?
              <AssignTask 
                currentProject={currentProject}
                currentMember={currentMember}
              /> :
              item === 'edit' ?
              <EditTask 
                currentTask={currentTask}
                selectZIndex={160}
              /> :
              item === 'member edit project task' ?
              <MemberEditTask 
                currentProject={currentProject}
                currentTask={currentTask}
                selectZIndex={160}
              /> :
              item === 'edit project' ?
              <EditProject 
                currentProject={currentProject}
              /> :
              item === 'task preview' ?
              <TaskPreview
                currentTask={currentTask}
              /> :
              item === 'admin task preview' ?
              <AdminTaskPreview
                currentProject={currentProject}
                currentTask={currentTask}
              /> :
              item === 'project members' ?
              <ProjectMembers
                currentProject={currentProject}
                currentMembers={currentMembers}
              /> :
              item === 'verify task completion' ?
              <VerifyTaskCompletionMessage 
                task={currentTask}
              /> :
              item === 'verify task deletion' ?
              <VerifyTaskDeletionMessage 
                task={currentTask}
              /> :
              item === 'verify project deletion' ?
              <VerifyProjectDeletionMessage 
                project={currentProject}
              /> :
              item === 'verify account deletion' ?
              <VerifyAccountDeletionMessage
              /> :
              item === 'join project' ?
              <JoinProject
              /> :
              item === 'invite link' ?
              <InviteLink
                currentInviteLink={currentInviteLink}
              /> :
              item === 'not image' ?
              <Message 
                popup='not image'
                heading="Can't Read The File"
                content='Your image should be saved as JPG, PNG, GIF, TIFF, HEIF or WebP'
              /> :
              item === 'small profile pic' ?
              <Message 
                popup='small profile pic'
                heading='Please Choose Another Image'
                content='This image is too small please upload a larger one'
              /> :
              item === 'big size image' ?
              <Message 
                popup='big size image'
                heading='Please Choose Another Image'
                content='Your image should be less than 3 MB'
              /> :
              item === 'crop profile pic' ?
              <ImageCrop
                popup='crop profile pic'
                bestWidth={170}
                bestHeight={170}
                imageFor='profilePic'
              /> :
              ''
            }
          </animated.div>
        ))
      }

      {/* second popup */}
			{
        secondDimTransition((style, item) => item && (
          <animated.div
            className='dim-background no-select'
            style={{ ...style, zIndex: 200 }}
          />
        ))
      }

			{
        secondPopupTransition((style, item) => item && (
          <animated.div
            ref={(el) => (popupsRef.current[1] = el)}
            className='popup'
            style={{ ...style, zIndex: 250 }}
          >
            {
              item === 'edit' ?
              <EditTask 
                currentTask={currentTask}
                selectZIndex={260}
              /> :
              item === 'member edit project task' ?
              <MemberEditTask 
                currentTask={currentTask}
                selectZIndex={260}
              /> :
              item === 'admin edit project task' ?
              <AdminEditTask 
              currentProject={currentProject}
                currentTask={currentTask}
              /> :
              item === 'verify task completion' ?
              <VerifyTaskCompletionMessage 
                task={currentTask}
              /> :
              item === 'verify task deletion' ?
              <VerifyTaskDeletionMessage 
                task={currentTask}
              /> :
              item === 'verify project task deletion' ?
              <VerifyProjectTaskDeletionMessage
                currentProject={currentProject}
                currentTask={currentTask}
              /> :
              item === 'confirm member removal' ?
              <VerifyMemberRemovalMessage
                currentProject={currentProject}
                currentMember={currentMember}
              /> :
              item === 'invite link' ?
              <InviteLink
                currentInviteLink={currentInviteLink}
              /> :
              item === 'not image' ?
              <Message 
                popup='not image'
                heading="Can't Read The File"
                content='Your image should be saved as JPG, PNG, GIF, TIFF, HEIF or WebP'
              /> :
              item === 'small task cover' ?
              <Message 
                popup='small task cover'
                heading='Please Choose Another Image'
                content='This image is too small please upload a larger one'
              /> :
              item === 'big size image' ?
              <Message 
                popup='big size image'
                heading='Please Choose Another Image'
                content='Your image should be less than 3 MB'
              /> :
              item === 'crop task cover' ?
              <ImageCrop
                popup='crop task cover'
                bestWidth={240}
                bestHeight={128}
                imageFor='task'
              /> :
              item === 'crop project cover' ?
              <ImageCrop
                popup='crop project cover'
                bestWidth={283}
                bestHeight={121}
                imageFor='project'
              /> :
              ''
            }
          </animated.div>
        ))
      }

      
      {/* third popup */}
			{
        thirdDimTransition((style, item) => item && (
          <animated.div
            className='dim-background no-select'
            style={{ ...style, zIndex: 300 }}
          />
        ))
      }

			{
        thirdPopupTransition((style, item) => item && (
          <animated.div
            ref={(el) => (popupsRef.current[2] = el)}
            className='popup'
            style={{ ...style, zIndex: 350 }}
          >
            {
              item === 'not image' ?
              <Message 
                popup='not image'
                heading="Can't Read The File"
                content='Your image should be saved as JPG, PNG, GIF, TIFF, HEIF or WebP'
              /> :
              item === 'small task cover' ?
              <Message 
                popup='small task cover'
                heading='Please Choose Another Image'
                content='This image is too small please upload a larger one'
              /> :
              item === 'big size image' ?
              <Message 
                popup='big size image'
                heading='Please Choose Another Image'
                content='Your image should be less than 3 MB'
              /> :
              item === 'crop task cover' ?
              <ImageCrop
                popup='crop task cover'
                bestWidth={240}
                bestHeight={128}
                imageFor='task'
              /> :
              item === 'only one step' ?
              <Message 
                popup='only one step'
                heading='Change the amount of steps'
                content="There can't be only one step, Please remove it or add another one"
              /> :
              ''
            }
          </animated.div>
        ))
      }
    </>
  )
}