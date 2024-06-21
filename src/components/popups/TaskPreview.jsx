import { useDispatch, useSelector } from 'react-redux'
import { addPopup, removePopup, setCurrentTask, incrementRenderCount } from '../../features/navigation/navigationSlice'
import { useState, useEffect } from 'react'
import { toggleStepApi } from '../../apis/tasksApi'
import useApi from '../../hooks/useApi'
import { format } from 'date-fns'
import CompleteStepIcon from '../../svg/others/CompleteStepIcon'
import CloseIcon from '../../svg/others/CloseIcon'
import FlagIcon from '../../svg/others/FlagIcon'
import '../../css/components/TaskPreview.css'

function areStepsDifferent(currentSteps, recordSteps) {
  if (!currentSteps || !recordSteps || currentSteps.length !== recordSteps.length) {
    return true
  }

  for (let i = 0; i < currentSteps.length; i++) {
    const currentStep = currentSteps[i]
    const recordStep = recordSteps.find(step => step._id === currentStep._id)

    if (!recordStep || recordStep.completed !== currentStep.completed) {
      return true
    }
  }

  return false
}

export default function TaskPreview({ currentTask }) {
  const myId = useSelector((state)=> state.user.id)

  const dispatch = useDispatch()

  const [image, setImage] = useState(currentTask.image)

  const {
		fetchApi : fetchToggleStepApi,
		apiData: toggleStepApiData,
		apiError: toggleStepApiError,
		apiLoading: toggleStepApiLoading
	} = useApi(toggleStepApi)

  // close popup when task is added correctly
	useEffect(() => {
    if (toggleStepApiData?.record) {
      if (areStepsDifferent(currentTask.steps, toggleStepApiData.record.steps)) {
        dispatch(setCurrentTask({ ...currentTask, steps: toggleStepApiData.record.steps }))
      }
    }
	}, [toggleStepApiData, dispatch, currentTask])

  const toggleTaskStep = async (i) => {
    const updatedSteps = [...currentTask.steps]
    updatedSteps[i] = {
      ...updatedSteps[i],
      completed: !updatedSteps[i].completed
    }

    await fetchToggleStepApi(updatedSteps, currentTask._id)
  }

  const stepStyles = (step) => {
    return {
      textDecoration: step.completed ? 'line-through 1px' : 'none',
      color: step.completed ? '#00FF29' : 'rgba(18, 18, 18, 0.65)',
      borderColor: step.completed ? '#00FF29' : 'rgba(18, 18, 18, 0.65)'
    }
  }

  if (toggleStepApiError) {
    console.log(toggleStepApiError)
  }

  return (
    <div className='task-preview-popup'>
      <div  className='task-preview-heading'>
        <p>{currentTask.name}</p>
        
        <CloseIcon
          className='close-task-preview'
          onClick={() => {
            dispatch(removePopup('task preview'))
            
            if (toggleStepApiData?.record) {
              dispatch(incrementRenderCount())
            }
          }}
        />
      </div>

      <div className='task-preview-upper-section'>
        <div className='task-preview-upper-left-section'>
          {
            currentTask?.tag?.name && (
              <div
                className='task-preview-tag'
                style={{ backgroundColor: currentTask.tag.color }}
              >
                {currentTask.tag.name}
              </div>
            )
          }


          {
            currentTask?.priority ? <FlagIcon priority={currentTask.priority}/> : ''
          }

          <div className='task-preview-date-container'>
            <p>
              Start date: {format(new Date(currentTask.startAt), "d MMM yyy 'at' h:mm aaa")}
            </p>

            <p>
              End date: {format(new Date(currentTask.endAt), "d MMM yyy 'at' h:mm aaa")}
            </p>
          </div>
        </div>

        {
          image && (
            <img
              className='task-preview-cover-image'
              src={`https://intime-9hga.onrender.com/api/v1/images/${image}`}
              alt='cover'
              onError={(e) => {
                e.target.onerror = null
                setImage('')
              }}
            />
          )
        }
      </div>

      {
        (currentTask.disc) && (
          <p className='task-preview-disc'>{currentTask.disc.replace(/\r\n/g, '\n')}</p>
        )
      }

      {
        currentTask.steps.length !== 0 && (
          <div className='task-preview-steps-container'>
            {
              currentTask.steps.map((step, i) => (
                <div 
                  key={step._id}
                  className='task-preview-step'
                  style={stepStyles(step)}
                >
                  <p>{step.stepDisc}</p>
                
                  <CompleteStepIcon
                    toggleStep={() => toggleTaskStep(i)}
                    isCompleted={step.completed}
                    style={{ pointerEvents: toggleStepApiLoading ? 'none' : '', cursor: toggleStepApiLoading ? 'auto' : '' }}
                  />
                  </div>
              ))
            }
          </div>
        )
      }

      {
        myId === currentTask.userId && (
          <div className='task-preview-button-wrapper'>
            <button
              className='task-preview-button red'
              onClick={() => dispatch(addPopup('verify task deletion'))}
            >
              Delete
            </button>

            {
              (!currentTask.completed) && (
                <div className='task-preview-left-button-wrapper-section'>
                  <button
                    className='task-preview-button white'
                    onClick={() => dispatch(addPopup('edit'))}
                  >
                    Edit
                  </button>

                  <button
                    className='task-preview-button blue'
                    onClick={() => dispatch(addPopup('verify task completion'))}
                  >
                    Finish
                  </button>
                </div>
              )
            }
          </div>  
        )
      }
    </div>
  )
}