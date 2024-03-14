import { useDispatch } from 'react-redux'
import { addPopup, removePopup, setCurrentTask } from '../../features/navigation/navigationSlice'
import { toggleStep } from '../../features/tasks/tasksSlice'
import { format } from "date-fns"
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

  return (
    <div className='task-preview-popup'>
      <div  className='task-preview-heading'>
        <p>{currentTask.title}</p>
        
        <CloseIcon
          className='close-task-preview'
          onClick={() => dispatch(removePopup('task preview'))}
        />
      </div>

      <div className='task-previw-upper-section'>
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
              {format(new Date(currentTask.startDate), "d MMM 'at' h:mm aaa")}
            </p>

            <p>
              {format(new Date(currentTask.endDate), "d MMM 'at' h:mm aaa")}
              </p>
          </div>
        </div>

        {
          currentTask.image && (
            <img
              className='task-preview-upper-right-section'
              src={currentTask.image}
              alt='cover' 
            />
          )
        }
      </div>

      {
        currentTask.disc && (
          <p className='current-task-disc'>{currentTask.disc}</p>
        )
      }

      {
        currentTask.steps.length !== 0 && (
          <div className='task-preview-steps-container'>
            {
              currentTask.steps.map((step, i) => (
                <div key={step.id} className='task-preview-step'>
                  <p className='task-preview-step-content'>
                    {step.content}
                  </p>

                  <CompleteStepIcon
                    toggleStep={() => toggleTaskStep(step, i)}
                  />
                </div>
              ))
            }
          </div>
        )
      }

      <div className='task-preview-button-wrapper'>
        <div className='task-preview-right-button-section'>
          <button
            className='task-preview-finish-button'
            onClick={() => dispatch(addPopup('verify task completion'))}
          >
            Finish
          </button>

          <button
            className='task-preview-edit-button'
            onClick={() => dispatch(addPopup('edit'))}
          >
            Edit
          </button>
        </div>

        <div>
          <button
            className='task-preview-delete-button'
            onClick={() => dispatch(addPopup('verify task deletion'))}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}