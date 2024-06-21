import { useDispatch } from 'react-redux'
import { addPopup, setCurrentTask } from '../../features/navigation/navigationSlice'
import HomeCompleteTaskIcon from '../../svg/home/HomeCompleteTaskIcon'
import HomeTaskTimeIcon from '../../svg/home/HomeTaskTimeIcon'
import FlagIcon from '../../svg/others/FlagIcon'

export default function HomeTask({ task }) {
  const dispatch = useDispatch()

  const verifyCompletion = (e) => {
    e.stopPropagation()
    dispatch(addPopup('verify task completion'))
    dispatch(setCurrentTask(task))
  }

  const openTaskPreview = () => {
    dispatch(addPopup('task preview'))
    dispatch(setCurrentTask(task))
  }

  const endDate = new Date(task.endAt).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })

  const taskPercentage = task?.steps ? parseFloat(
    (task.steps.filter((step) => step.completed).length / task.steps.length * 100)
    .toFixed(2) 
  ) : ''

  const percentageBarStyles = {
    width: `${task?.steps.length !== 0 ? taskPercentage : 0}%`,
    backgroundColor: 
      taskPercentage <= 25 
        ? '#D20000'
        : taskPercentage <= 50
          ? '#DE700B'
          : taskPercentage <= 75
            ? '#E8FC00'
            : '#00FF29'
  }
  
  return (
    <div className='home-task-container' onClick={openTaskPreview}>
      <div className='home-task-left'>
        <HomeCompleteTaskIcon verifyCompletion={verifyCompletion}/>

        <div className='home-task-info'>
          <p className='home-task-title'>{task.name}</p>

          <div className='home-task-date-container'>
            <HomeTaskTimeIcon />
            
            <p className='home-task-date'>
              {
                endDate.charAt(0) + endDate.slice(1).toLowerCase()
              }
            </p>
          </div>
        </div>
      </div>

      <div className='home-task-right'>
        <div className='home-task-percentage-container'>
          <p className='home-task-percentage'>
            {
              task?.steps.length !== 0 ? taskPercentage : 0
            }
            % completed
          </p>

          <div className='home-task-bar-container'>
            <div className='home-task-percentage-bar' style={percentageBarStyles}/>
          </div>
        </div>

        {
          task?.priority ? <FlagIcon priority={task.priority}/> : ''
        }
      </div>

      {
        task?.steps.length !== 0 ? 
        <p className='home-task-steps'>
          {
            task.steps.filter((step) => step.completed).length + '/' + task.steps.length
          }
        </p> :
        ''
      }
    </div>
  )
}