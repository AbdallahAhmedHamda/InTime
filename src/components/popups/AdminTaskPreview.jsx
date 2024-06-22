import { useDispatch } from 'react-redux'
import { addPopup, removePopup } from '../../features/navigation/navigationSlice'
import { useState } from 'react'
import { format } from 'date-fns'
import CloseIcon from '../../svg/others/CloseIcon'
import FlagIcon from '../../svg/others/FlagIcon'
import '../../css/components/TaskPreview.css'

export default function AdminTaskPreview({ currentTask, currentProject }) {
  const dispatch = useDispatch()

  const [image, setImage] = useState(currentTask.image)

  return (
    <div className='task-preview-popup'>
      <div  className='task-preview-heading'>
        <p>{currentTask.name}</p>
        
        <CloseIcon
          className='close-task-preview'
          onClick={() => {
            dispatch(removePopup('admin task preview'))
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
            currentTask?.priority !== undefined ? <FlagIcon priority={currentTask.priority}/> : ''
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

      <div className='task-preview-button-wrapper'>
        <button
          className='task-preview-button red'
          onClick={() => dispatch(addPopup('verify project task deletion'))}
        >
          Delete
        </button>

        {
          !currentTask.completed && (
            <div className='task-preview-left-button-wrapper-section'>
              <button
                className='task-preview-button white'
                onClick={() => {
                  dispatch(addPopup('admin edit project task'))
                }}
              >
                Edit
              </button>
            </div>
          )
        }
      </div>  
    </div>
  )
}