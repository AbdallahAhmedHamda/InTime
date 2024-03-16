import { useDispatch, useSelector } from 'react-redux'
import { removePopup, setCurrentTask } from '../features/navigation/navigationSlice'
import { useRef, useEffect } from 'react'
import { useTransition, animated } from 'react-spring'
import VerifyCompletionMessage from './popups/VerifyCompletionMessage'
import VerifyDeletionMessage from './popups/VerifyDeletionMessage'
import TaskCoverCrop from './popups/TaskCoverCrop'
import TaskPreview from './popups/TaskPreview'
import EditTask from './popups/EditTask'
import AddTask from './popups/AddTask'
import Message from './popups/Message'

export default function Popups() {
  const popups = useSelector((state) => state.navigation.popups)
  const currentTask = useSelector((state) => state.navigation.currentTask)
  
  const dispatch = useDispatch()

  const popupsRef = useRef([])

  // disable page scrollbars when popus are active
  useEffect(() => {
    let clearReduxTimeout

    if (popups.length !== 0) {
      document.body.style.overflow = 'hidden'
    } else if (currentTask) {
      clearReduxTimeout = setTimeout(() => {
        dispatch(setCurrentTask(''))
      }, 300)
    }
    
    return () => {
      document.body.style.overflow = 'auto'
      clearTimeout(clearReduxTimeout)
    }
    // eslint-disable-next-line
  }, [popups])

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
    // eslint-disable-next-line
  }, [popups])
  
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
              item === 'edit' ?
              <EditTask 
                currentTask={currentTask}
                selectZIndex={160}
              /> :
              item === 'task preview' ?
              <TaskPreview
                currentTask={currentTask}
              /> :
              item === 'verify task completion' ?
              <VerifyCompletionMessage 
                task={currentTask}
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
              item === 'verify task completion' ?
              <VerifyCompletionMessage 
                task={currentTask}
              /> :
              item === 'verify task deletion' ?
              <VerifyDeletionMessage 
                task={currentTask}
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
              <TaskCoverCrop /> :
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
              <TaskCoverCrop /> :
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