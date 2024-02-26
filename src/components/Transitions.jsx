import { useTransition, animated } from 'react-spring'
import { useSelector } from 'react-redux'
import AddTask from './popups/AddTask'
import Message from './popups/Message'
import TaskCoverCrop from './popups/TaskCoverCrop'

export default function Transitions() {
  const popups = useSelector((state) => state.navigation.popups)

  // animate first dimming
  const firstDimTransition = useTransition(popups[0], {
    from: { backgroundColor: 'rgba(0, 0, 0, 0)', pointerEvents: 'none' },
    enter: { backgroundColor: 'rgba(0, 0, 0, 0.3)', pointerEvents: 'auto' },
    leave: { backgroundColor: 'rgba(0, 0, 0, 0)', pointerEvents: 'none' },
    config: { duration: 300 }
  })
  
  // animate first popup appearance
  const firstPopupTransition = useTransition(popups[0], {
    from: { opacity: 0, top: '40%', pointerEvents: 'none' },
    enter: { opacity: 1, top: '50%', pointerEvents: 'auto' },
    leave: { opacity: 0, top: '40%', pointerEvents: 'none' },
    config: { duration: 300 }
  })

  // animate second dimming
  const secondDimTransition = useTransition(popups[1], {
    from: { backgroundColor: 'rgba(0, 0, 0, 0)', pointerEvents: 'none' },
    enter: { backgroundColor: 'rgba(0, 0, 0, 0.3)', pointerEvents: 'auto' },
    leave: { backgroundColor: 'rgba(0, 0, 0, 0)', pointerEvents: 'none' },
    config: { duration: 300 }
  })
  
  // animate second popup appearance
  const secondPopupTransition = useTransition(popups[1], {
    from: { opacity: 0, top: '40%', pointerEvents: 'none' },
    enter: { opacity: 1, top: '50%', pointerEvents: 'auto' },
    leave: { opacity: 0, top: '40%', pointerEvents: 'none' },
    config: { duration: 300 }
  })

  return (
    <>
			{/* first popup */}
			{firstDimTransition((style, item) => item && (
				<animated.div className='dim-background no-select' style={{...style, zIndex: 100}} />
			))}

			{firstPopupTransition((style, item) => item && (
				<animated.div className='popup' style={{...style, zIndex: 150}}>
					{item === 'add' ? <AddTask /> : ''}
				</animated.div>
			))}

      {/* second popup */}
			{secondDimTransition((style, item) => item && (
				<animated.div className='dim-background no-select' style={{...style, zIndex: 200}} />
			))}

			{secondPopupTransition((style, item) => item && (
				<animated.div className='popup' style={{...style, zIndex: 250}}>
					{item === 'not image' ? 
          <Message 
            popup="not image"
            heading="Can't Read The File"
            content="Your image should be saved as JPG, PNG, GIF, TIFF, HEIF or WebP"
          /> 
          : item === 'small task cover' ? 
          <Message 
            popup="small task cover"
            heading="Please Choose Another Image"
            content="This image is too small please upload a larger one"
          /> 
          : item === "big size image" ? 
          <Message 
            popup="big size image"
            heading="Please Choose Another Image"
            content="Your image should be less than 3 MB"
          /> 
          : item === "crop task cover" ?
          <TaskCoverCrop />
          : item === "only one step" ?
          <Message 
            popup="only one step"
            heading="Change the amount of steps"
            content="There can't be only one step, Please remove it or add another one"
          /> 
          : ''}
				</animated.div>
			))}
    </>
  )
}