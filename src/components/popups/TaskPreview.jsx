import { useDispatch } from 'react-redux'
import { addPopup, removePopup, setCurrentTask } from '../../features/navigation/navigationSlice'
import { toggleStep } from '../../features/tasks/tasksSlice'
import { format } from 'date-fns'
import CompleteStepIcon from '../../svg/others/CompleteStepIcon'
import CloseIcon from '../../svg/others/CloseIcon'
import FlagIcon from '../../svg/others/FlagIcon'
import '../../css/components/TaskPreview.css'

export default function TaskPreview({ currentTask }) {
  const dispatch = useDispatch()

  const toggleTaskStep = (step, i) => {
    const completedSteps = currentTask.steps.filter(task => task.isCompleted).length

    if (!step.isCompleted && completedSteps === currentTask.steps.length - 1) {
      dispatch(addPopup('verify task completion'))
    } else {
      const updatedSteps = [...currentTask.steps]
      updatedSteps[i] = {
        ...updatedSteps[i],
        isCompleted: !updatedSteps[i].isCompleted
      }
  
      dispatch(setCurrentTask({ ...currentTask, steps: updatedSteps}))
      dispatch(toggleStep({ taskId: currentTask.id, stepId: step.id }))
    }
  }

  const stepStyles = (step) => {
    return {
      textDecoration: step.isCompleted ? 'line-through 1px' : 'none',
      color: step.isCompleted ? '#00FF29' : 'rgba(18, 18, 18, 0.65)',
      borderColor: step.isCompleted ? '#00FF29' : 'rgba(18, 18, 18, 0.65)'
    }
  }

  return (
    <div className='task-preview-popup'>
      <div  className='task-preview-heading'>
        <p>{currentTask.title}</p>
        
        <CloseIcon
          className='close-task-preview'
          onClick={() => dispatch(removePopup('task preview'))}
        />
      </div>

      <div className='task-preview-upper-section'>
        <div className='task-preview-upper-left-section'>
          <div
            className='task-preview-tag'
            style={{ backgroundColor: currentTask.tag.color }}
          >
            {currentTask.tag.name}
          </div>

          <FlagIcon priority={currentTask.flag}/>

          <div className='task-preview-date-container'>
            <p>
              Start date: {format(new Date(currentTask.startDate), "d MMM 'at' h:mm aaa")}
            </p>

            <p>
              End date: {format(new Date(currentTask.endDate), "d MMM 'at' h:mm aaa")}
              </p>
          </div>
        </div>

        {
          currentTask.image && (
            <img
              className='task-preview-cover-image'
              src={currentTask.image}
              alt='cover' 
            />
          )
        }
      </div>

      {
        (currentTask.disc ||
        currentTask.disc !== '') && (
          <p className='task-preview-disc'>{currentTask.disc}</p>
        )
      }

      {
        currentTask.steps.length !== 0 && (
          <div className='task-preview-steps-container'>
            {
              currentTask.steps.map((step, i) => (
                <div 
                  key={step.id}
                  className='task-preview-step'
                  style={stepStyles(step)}
                >
                  <p>{step.content}</p>
                
                  <CompleteStepIcon
                    toggleStep={() => toggleTaskStep(step, i)}
                    isCompleted={step.isCompleted}
                  />
                  </div>
              ))
            }
          </div>
        )
      }

      <div className='task-preview-button-wrapper'>
        <div className='task-preview-left-button-wrapper-section'>
          <button
            className='task-preview-button blue'
            onClick={() => dispatch(addPopup('verify task completion'))}
          >
            Finish
          </button>

          <button
            className='task-preview-button white'
            onClick={() => dispatch(addPopup('edit'))}
          >
            Edit
          </button>
        </div>

        <button
          className='task-preview-button red'
          onClick={() => dispatch(addPopup('verify task deletion'))}
        >
          Delete
        </button>
      </div>
    </div>
  )
}