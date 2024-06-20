import { useSelector, useDispatch } from 'react-redux'
import { addPopup, removePopup, setUncroppedTaskImage, setCroppedTaskImage, setCurrentTask, incrementRenderCount } from '../../features/navigation/navigationSlice'
import { useEffect, useState, useRef, useCallback } from 'react'
import { updateTaskApi } from '../../apis/TasksApi'
import useApi from '../../hooks/useApi'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { nanoid } from '@reduxjs/toolkit'
import Select from 'react-select'
import ordinal from 'ordinal'
import dayjs from 'dayjs'
import colors from '../../data/colors'
import calendarIcon from '../../assets/images/calendar-icon.png'
import CameraIcon from '../../svg/others/CameraIcon'
import CloseIcon from '../../svg/others/CloseIcon'
import FlagIcon from '../../svg/others/FlagIcon'
import '../../css/components/AddEditTask.css'

const options = [
  {
    value: 3,
    label: <FlagIcon priority={3} />
  },
  {
    value: 2,
    label: <FlagIcon priority={2} />
  },
  {
    value: 1,
    label: <FlagIcon priority={1} />
  },
  {
    value: 0,
    label: <FlagIcon priority={0} />
  }
]

export default function EditTask({ currentTask, selectZIndex }) {
  const allTags = useSelector((state) => state.user.tags)
  const croppedImage = useSelector((state) => state.navigation.croppedTaskImage)

  const dispatch = useDispatch()

  const [values, setValues] = useState({
    name: currentTask.name,
    disc: currentTask.disc ? currentTask.disc.replace(/\r\n/g, '\n') : currentTask.disc,
    image: currentTask.image ? `https://intime-9hga.onrender.com/api/v1/images/${currentTask.image}` : currentTask.image,
    tag: currentTask?.tag?.name ? currentTask.tag.name : '',
    priority: options[3 - currentTask.priority],
    startAt: dayjs(currentTask.startAt),
    endAt: dayjs(currentTask.endAt),
    steps: currentTask.steps
  })
  const [nameError, setNameError] = useState('')
  const [coverHovered, setCoverHovered] = useState(false)
  const [apiCallAttempt, setApiCallAttempt] = useState(0)

  const imageInputRef = useRef()

  const {
		fetchApi : fetchUpdateTaskApi,
		apiData: updateTaskApiData,
		apiError: updateTaskApiError,
		apiLoading: updateTaskApiLoading
	} = useApi(updateTaskApi)

  const setTagColor = useCallback(() => {
    if (values.tag.trim() === '') {
      return { name: '', color: '' }
    } else {
      const tag = { name: values.tag }
      const tagName = values.tag.toLowerCase()

      const tagIndex = allTags.findIndex(arrayTag => arrayTag.name.toLowerCase() === tagName)

      if (tagIndex !== -1) {
        tag.color = allTags[tagIndex].color
      } else {
        if (allTags.length !== 0) {
          const lastColor = allTags[allTags.length - 1].color
          const lastColorIndex = colors.findIndex(color => color === lastColor)
          tag.color = colors[(lastColorIndex + 1) % 50]
        } else {
          tag.color = colors[0]
        }
      }
  
      return tag 
    }
  }, [values.tag, allTags])

  // remove saved images from redux when popup unmounts
  useEffect(() => {
    return () => {
      dispatch(setUncroppedTaskImage(''))
      dispatch(setCroppedTaskImage(''))
    }
  }, [dispatch])

  // set task cover when its cropped
  useEffect(() => {
    if (croppedImage) {
      setValues(prevState => ({ ...prevState, image: croppedImage }))
    }
  }, [croppedImage])

  // close popup when task is added correctly
	useEffect(() => {
    if (updateTaskApiData) {
      dispatch(setCurrentTask({
        ...values,
        tag: setTagColor(),
        priority: values.priority.value,
        startAt: values.startAt.toISOString(),
        endAt: values.endAt.toISOString(),
      }))

      dispatch(removePopup('edit'))

      dispatch(incrementRenderCount())
    }
	}, [updateTaskApiData, dispatch, setTagColor, values])

  // handle update api errors
	useEffect(() => {
    if (updateTaskApiError === 'you have task with the same name') {
      setNameError('This task name already exists!')
    } else if (updateTaskApiError) {
      console.log(updateTaskApiError)
    }
	}, [updateTaskApiError, apiCallAttempt, dispatch])

  // handle image selection
  const onImageSelection = (e) => {
    const file = e.target.files[0]
    const sizeInMB = file.size / 1024 / 1024
    e.target.value = null

    if (!file?.type.startsWith('image/')) {
      dispatch(addPopup('not image'))
    } else {
      const reader = new FileReader()

      reader.onload = () => {
        const img = new Image()
        img.src = reader.result

        img.onload = (e) => {
          const { naturalWidth, naturalHeight } = e.currentTarget

          if (naturalWidth < 240 || naturalHeight < 128) {
            dispatch(addPopup('small task cover'))
          } else if (sizeInMB > 3) {
            dispatch(addPopup('big size image'))
          } else {
            dispatch(addPopup('crop task cover'))
            dispatch(setUncroppedTaskImage(reader.result))
          }
        }
      }

      reader.readAsDataURL(file)
    }
  }

  // handle clicking on date and time icons so each can open it corresponding picker
  const handleIconClick = (position) => {
    document.querySelector(`.${position}-date .MuiInputBase-root`).click()
  }
 
  const addStep = () => {
    setValues({
      ...values,
      steps: [
        ...values.steps,
        {
          stepDisc: '',
          _id: nanoid()
        }
      ]
    })
  }

  const removeStep = (id) => {
    setValues({
      ...values,
      steps: values.steps.filter((step) => step._id !== id)
    })
  }
  
  const selectImage = () => {
    imageInputRef.current.click()
  }

  const onTextInputChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })

    if (e.target && e.target.name === 'name') {
      setNameError('')
    }
  }

  const onKeyDownHandler = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (e.target.classList.contains('disc-input') && values?.disc && values.disc.length < 300) {
        setValues({ ...values, [e.target.name]: e.target.value + '\n' })
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const nameChanged = currentTask.name !== values.name
    
    await fetchUpdateTaskApi({
      ...values,
      tag: setTagColor(),
      priority: values.priority.value,
      startAt: values.startAt.toISOString(),
      endAt: values.endAt.toISOString(),
    }, currentTask._id, nameChanged)

    setApiCallAttempt(prevAttempts => prevAttempts + 1)
  }
  
  const today = dayjs()
    .startOf('minute')
    .add(30 - dayjs().minute() % 30, 'minutes')
  const minEndDateTime = today.isAfter(values.startAt) ? today : values.startAt
    
  return (
    <form
      className='edit-popup'
      onSubmit={handleSubmit}
      onKeyDown={onKeyDownHandler}
    >
      <div className='popup-blue-heading' />

      <div  className='edit-heading'>
        <p>Edit task</p>

        <CloseIcon
          className='close-edit'
          onClick={() => dispatch(removePopup('edit'))}
        />
      </div>
      
      <div  className='edit-content'>
        <div className='input-block'>
          <label htmlFor='title'>Title</label>

          <input
            autoFocus
            spellCheck='false'
            autoComplete='off'
            required={true}
            pattern='.*\S+.*'
            title='Include other letters than space!'
            className='task-title-input'
            type='text'
            name='name'
            id='name'
            value={values.name}
            onChange={onTextInputChange}
            placeholder='Enter a title....'
          />

          {nameError ? <p className='same-name-error'>{nameError}</p> : ''}
        </div>

        <div className='input-block disc-input-block'>
          <label htmlFor='disc' className='optional-input-wrapper'>
            <p>Description</p>
            
            <p className='optional-input'>(optional)</p>
          </label>

          <textarea
            className='disc-input'
            name='disc'
            id='disc'
            value={values.disc}
            onChange={onTextInputChange}
            placeholder='Add description....'
            maxLength='300'
            autoComplete='off'
            autoCorrect='off'
            autoCapitalize='off'
            spellCheck='false'
            data-gramm='false'
            data-gramm_editor='false'
            data-enable-grammarly='false'
          />

          <p className='disc-max-letters'>
            {values?.disc ? values.disc.length : 0}/300
          </p>
        </div>

        <div className='third-line-wrapper'>
          <div className='input-block'>
            <div className='optional-input-wrapper'>
              <p>Cover photo</p>
              
              <p className='optional-input'>(optional)</p>
            </div>

            <input
              type='file'
              id='cover'
              accept='image/png, image/jpeg'
              onChange={onImageSelection}
              hidden={true}
              ref={imageInputRef}
            />

            {
              !values.image ?
              <div className='task-cover-select' >
                <button type='button' onClick={selectImage}>
                  Select Image
                </button>
              </div> :
              <div 
                className='task-cover-container'
                onMouseEnter={() => setCoverHovered(true)}
                onMouseLeave={() => setCoverHovered(false)}
              >
                <img 
                  src={values.image}
                  alt='cover' 
                  onError={(e) => {
                    e.target.onerror = null
                    setValues({
                      ...values,
                      image: ''
                    })
                  }}
                  className='task-cover-input'
                />
                {
                  coverHovered ?
                  <div>
                    <CloseIcon
                      className='task-cover-remove'
                      onClick={() => {
                        dispatch(setUncroppedTaskImage(''))
                        setValues({
                          ...values,
                          image: ''
                        })
                      }}
                    />

                    <CameraIcon selectImage={selectImage}/>
                  </div> :
                  ''
                }
              </div>
            }
          </div>

          <div className='input-block'>
            <label htmlFor='tag' className='optional-input-wrapper'>
              <p>Tag</p>
              
              <p className='optional-input'>(optional)</p>
            </label>

            <input
              spellCheck='false'
              autoComplete='off'
              className='tag-input'
              type='text'
              id='tag'
              name='tag'
              value={values.tag}
              onChange={onTextInputChange}
              placeholder='Add tag...'
            />
          </div>

          <div className='input-block'>
            <p>Priority</p>

            <Select
              isSearchable={false}
              options={options}
              classNames={{
                option: () =>
                  'edit-flag-option'
              }}
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: selectZIndex}),
                menuList: (base) => ({ ...base, paddingBlock: 0}),
                option: (base) => ({ ...base, display: 'flex', cursor: 'pointer' })
              }}
              menuPortalTarget={document.body}
              menuShouldScrollIntoView={false}
              menuPosition='fixed'
              value={values.priority}
              onChange={(value) =>
                setValues({
                ...values,
                priority: value
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
                  format='MM/D/YYYY [at] h:mm a'
                  value={values.startAt}
                  disableHighlightToday={true}
                  showDaysOutsideCurrentMonth={true}
                  slotProps={{ field: { shouldRespectLeadingZeros: true } }}
                  onChange={(newStartDate) =>
                    setValues({
                      ...values,
                      startAt: newStartDate,
                      endAt:
                        newStartDate > values.endAt
                          ? newStartDate.add(60, 'minutes')
                          : values.endAt
                    }
                  )}
                />
              </LocalizationProvider>
          
              <img
                src={calendarIcon}
                alt='Date picker opening icon'
                className='date-time-icon'
                onClick={() => handleIconClick('start')}
              />
            </div>
          </div>
          
          <div className='input-block'>
            <p>End date</p>
            
            <div className='date-time-container'>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileDateTimePicker
                  className='end-date'
                  format='MM/D/YYYY [at] h:mm a'
                  value={values.endAt}
                  disableHighlightToday={true}
                  showDaysOutsideCurrentMonth={true}
                  minDateTime={minEndDateTime}
                  slotProps={{ field: { shouldRespectLeadingZeros: true } }}
                  onChange={(newEndDate) => setValues({
                    ...values,
                    endAt: newEndDate
                  })}
                />
              </LocalizationProvider>
          
              <img
                src={calendarIcon}
                alt='Date picker opening icon'
                className='date-time-icon'
                onClick={() => handleIconClick('end')}
              />
            </div>
          </div>
        </div>

        {
          values.steps.map((step, i) => (
            <div key={step._id} className='input-block'>
              <label htmlFor={`step-num-${i + 1}`}>step {i + 1}</label>

              <div className='step-wrapper'>
                <input
                  required={true}
                  pattern='.*\S+.*'
                  title='Include other letters than space!'
                  spellCheck='false'
                  autoComplete='off'
                  className='step-input'
                  type='text'
                  name={`step-num-${i + 1}`}
                  id={`step-num-${i + 1}`}
                  value={values.steps[i].stepDisc}
                  onChange={(e) => {
                    const updatedSteps = [...values.steps]
                    updatedSteps[i] = { ...updatedSteps[i], stepDisc: e.target.value }
                    setValues({ ...values, steps: updatedSteps })
                  }}
                  placeholder={`My ${ordinal(i + 1)} step is...`}
                />

                <CloseIcon
                  className='remove-step'
                  onClick={() => removeStep(step._id)}
                />
              </div>
            </div>
          ))
        }

        <div className='input-block'>
          {values?.steps && values.steps.length === 0 ? <p>Steps</p> : ''}

          <button
            type='button'
            className='add-step-button'
            onClick={addStep}
          >
            Add step <span>+</span>
          </button>
        </div>

        <div className='popup-button-wrapper'>
          <button
            type='submit'
            className='edit-task-button'
            disabled={updateTaskApiLoading}
          >
            Edit
          </button>
          
          <button
            type='button'
            className='cancel-edit-task-button'
            onClick={() => dispatch(removePopup('edit'))}
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  )
}