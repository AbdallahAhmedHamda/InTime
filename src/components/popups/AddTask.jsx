import { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker'
import { addPopup, removePopup, setUncroppedImage, setCroppedImage } from '../../features/navigation/navigationSlice'
import { addTask } from '../../features/tasks/tasksSlice'
import { addTaskId } from '../../features/user/userSlice'
import dayjs from 'dayjs'
import Select from 'react-select'
import '../../css/components/AddEditTask.css'
import calendarIcon from '../../assets/images/calendar-icon.png'
import CameraIcon from '../../svg/others/CameraIcon'
import FlagIcon from '../../svg/others/FlagIcon'
import CloseIcon from '../../svg/others/CloseIcon'
import { nanoid } from '@reduxjs/toolkit'
import ordinal from 'ordinal'

const options = [
  {
    value: 1,
    label: <FlagIcon priority={1} />
  },
  {
    value: 2,
    label: <FlagIcon priority={2} />
  },
  {
    value: 3,
    label: <FlagIcon priority={3} />
  },
  {
    value: 4,
    label: <FlagIcon priority={4} />
  }
]

export default function AddTask() {
  const showPopup = useSelector((state) => state.navigation.popups)
  const croppedImage = useSelector((state) => state.navigation.croppedImage)

  const dispatch = useDispatch()

  const [values, setValues] = useState({
    title: '',
    disc: '',
    tag: '',
    flag: options[0],
    image: '',
    startDate: dayjs().startOf('minute').add(30 - dayjs().minute() % 30, 'minutes'),
    endDate: dayjs().startOf('minute').add(90 - dayjs().minute() % 30, 'minutes'),
    steps: []
  })
  const [coverHovered, setCoverHovered] = useState(false)

  const imageInputRef = useRef()

  // set task cover when its cropped
  useEffect(() => {
    if (croppedImage) {
      setValues(prevState => ({...prevState, image: croppedImage}))
      dispatch(setCroppedImage(''))
    }
    // eslint-disable-next-line
  }, [croppedImage])

  // disable page scrollbars when popup is active
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [showPopup])  

  // handle clicking on date and time icons so each can open it corresponding picker
  const handleIconClick = (position) => {
    document.querySelector(`.${position}-date .MuiInputBase-root`).click()
  }

  // handle inputs change
  const onTextInputChange = (event) => {
    setValues({...values, [event.target.name]: event.target.value})
  }

  // handle image selection
  const onImageSelection = (event) => {
    const file = event.target.files[0]
    const sizeInMB = file.size / 1024 / 1024
    event.target.value = null
    if (!file?.type.startsWith('image/')) {
      dispatch(addPopup('not image'))
    } else {
      const reader = new FileReader()

      reader.onload = () => {
        const img = new Image()
        img.src = reader.result

        img.onload = (event) => {
          const { naturalWidth, naturalHeight } = event.currentTarget
          if (naturalWidth < 227 || naturalHeight < 121) {
            dispatch(addPopup('small task cover'))
          } else if (sizeInMB > 3) {
            dispatch(addPopup('big size image'))
          } else {
            dispatch(addPopup('crop task cover'))
            dispatch(setUncroppedImage(reader.result))
          }
        }
      }

      reader.readAsDataURL(file)
    }
  }
 
  // add step
  const addStep = (e) => {
    e.preventDefault()
    if (values.steps.length === 0) {
      setValues({
        ...values,
        steps: [
          {
            id: nanoid(),
            content: '',
            isCompleted: false
          },
          {
            id: nanoid(),
            content: '',
            isCompleted: false
          }
        ]
      })
    } else {
      setValues({
        ...values,
        steps: [...values.steps, {
          id: nanoid(),
          content: '',
          isCompleted: false
        }]
      })
    }
  }

  // remove step
  const removeStep = (id) => {
    setValues({
      ...values,
      steps: values.steps.filter(step => step.id !== id)
    })
  }
  
  // select image when user clicks on a specific onject
  const selectImage = () => {
    imageInputRef.current.click()
  }

  // handle form submit
  const handleSubmit = (event) => {
    event.preventDefault()
    if (values.steps.length === 1) {
      dispatch(addPopup('only one step'))
    } else {
      const taskId = nanoid()
      dispatch(addTaskId(taskId))
      dispatch(addTask({
        id: taskId,
        createdAt: dayjs().toISOString(),
        ...values,
        flag: values.flag.value,
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
        isCompleted: false
      }))
      dispatch(removePopup('add'))
    }
  }
    
  return (
    <form className='add-popup' onSubmit={handleSubmit}>
      <div className='popup-blue-heading' />

      <div  className='add-heading'>
        <p>Add new task</p>

        <CloseIcon
          className='close-add'
          onClick={() => dispatch(removePopup('add'))}
        />
      </div>
      
      <div  className="add-content">
        <div className='input-block'>
          <p>Title</p>

          <input
            required={true}
            className='task-title-input'
            type='text'
            name='title'
            value={values.title}
            onChange={onTextInputChange}
            placeholder='Enter a title....'
          />
        </div>
        <div className='input-block'>
          <div className='optional-input-wrapper'>
            <p>Description</p>
            
            <p className='optional-input'>(optional)</p>
          </div>

          <textarea
            className='disc-input'
            name='disc'
            value={values.disc}
            onChange={onTextInputChange}
            placeholder='Add description....'
          />
        </div>

        <div className='third-line-wrapper'>
          <div className='input-block'>
            <div className='optional-input-wrapper'>
              <p>Cover photo</p>
              
              <p className='optional-input'>(optional)</p>
            </div>

            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={onImageSelection}
              hidden={true}
              ref={imageInputRef}
            />

            {!values.image
            ?
            <div className='task-cover-select' >
              <span onClick={selectImage}>
                Select Image
              </span>
            </div>
            :
            <div 
              className='task-cover-container'
              onMouseEnter={() => setCoverHovered(true)}
              onMouseLeave={() => setCoverHovered(false)}
            >
              <img 
                alt='cover' 
                src={values.image}
                className='task-cover-input'
              />
              {coverHovered
              ?
              <div>
                <CloseIcon
                  className='task-cover-remove'
                  onClick={() => {
                    setValues({
                      ...values,
                      image: ''
                    })
                  }}
                />
                <CameraIcon selectImage={selectImage}/>
              </div>
              :
              ''
              }
            </div>
            }
          </div>

          <div className='input-block'>
            <p>Tag</p>

            <input
              required={true}
              className='tag-input'
              type='text'
              name='tag'
              value={values.tag}
              onChange={onTextInputChange}
              placeholder='Add tag...'
            />
          </div>

          <div className='input-block'>
            <p>Flag</p>

            <Select
              isSearchable={false}
              options={options}
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 160}), option: (base) => ({ ...base, display: 'flex', cursor: 'pointer' }) }}
              menuPortalTarget={document.body}
              menuShouldScrollIntoView={false}
              menuPosition='fixed'
              value={values.flag}
              onChange={(value) =>
                setValues({
                ...values,
                flag: value
              })}
            >
            </Select>
          </div>
        </div>

        <div className='fourth-line-wrapper'>
          <div className='input-block'>
            <p>Start date</p>

            <div className='date-time-container'>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileDateTimePicker
                  className='start-date'
                  format="MM/D/YYYY [at] h:mm a"
                  value={values.startDate}
                  disableHighlightToday={true}
                  showDaysOutsideCurrentMonth={true}
                  slotProps={{ field: { shouldRespectLeadingZeros: true } }}
                  onChange={(newStartDate) =>
                    setValues({
                      ...values,
                      startDate: newStartDate,
                      endDate: newStartDate > values.endDate ? newStartDate.add(60, 'minutes') : values.endDate
                    }
                  )}
                />
              </LocalizationProvider>
          
              <img src={calendarIcon} alt="Date picker opening icon" className='date-time-icon' onClick={() => handleIconClick('start')}/>
            </div>
          </div>
          
          <div className='input-block'>
            <p>End date</p>
            
            <div className='date-time-container'>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileDateTimePicker
                  className='end-date'
                  format="MM/D/YYYY [at] h:mm a"
                  value={values.endDate}
                  disableHighlightToday={true}
                  showDaysOutsideCurrentMonth={true}
                  minDateTime={values.startDate}
                  slotProps={{ field: { shouldRespectLeadingZeros: true } }}
                  onChange={(newEndDate) => setValues({
                    ...values,
                    endDate: newEndDate
                  })}
                />
              </LocalizationProvider>
          
              <img src={calendarIcon} alt="Date picker opening icon" className='date-time-icon' onClick={() => handleIconClick('end')}/>
            </div>
          </div>
        </div>

        {values.steps.map((step, i) => (
          <div key={step.id} className='input-block'>
            <p>step {i + 1}</p>

            <div className='step-wrapper'>
              <input
                required={true}
                className='step-input'
                type='text'
                name='title'
                value={values.steps[i].content}
                onChange={(event) => {
                  const steps = values.steps
                  steps[i].content = event.target.value
                  setValues({ ...values, steps: steps })
                }}
                placeholder={`My ${ordinal(i + 1)} step is...`}
              />

              <CloseIcon
                className='remove-step'
                onClick={() => removeStep(step.id)}
              />
            </div>
          </div>
        ))}

        <div className='input-block'>
          {values.steps.length === 0 ? <p>Steps</p> : ''}

          <button className='add-step-button' onClick={addStep}>
            Add step <span>+</span>
          </button>
        </div>

        <div className='popup-button-wrapper'>
          <button className='add-task-button'>Add</button>
          
          <button 
            onClick={(e) => {
              e.preventDefault()
              dispatch(removePopup('add'))}
            }
            className='cancel-add-task-button'
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  )
}