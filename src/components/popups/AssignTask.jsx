import { useDispatch } from 'react-redux'
import { removePopup, setActionDone } from '../../features/navigation/navigationSlice'
import { useEffect, useState } from 'react'
import { assignTaskApi } from '../../apis/projectsApi'
import useApi from '../../hooks/useApi'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import dayjs from 'dayjs'
import calendarIcon from '../../assets/images/calendar-icon.png'
import CloseIcon from '../../svg/others/CloseIcon'
import '../../css/components/AssignTask.css'

export default function AssignTask({ currentProject, currentMember }) {
  const dispatch = useDispatch()

  const [values, setValues] = useState({
      name: '',
      disc: '',
      startAt: dayjs()
          .startOf('minute')
          .add(30 - dayjs().minute() % 30, 'minutes'),
      endAt: dayjs()
          .startOf('minute')
          .add(90 - dayjs().minute() % 30, 'minutes'),
    }
  )
  const [nameError, setNameError] = useState('')
  const [apiCallAttempt, setApiCallAttempt] = useState(0)

  const {
		fetchApi : fetchAssignTaskApi,
		apiData: assignTaskApiData,
		apiError: assignTaskApiError,
		apiLoading: assignTaskApiLoading
	} = useApi(assignTaskApi)

  // close popup when task is added correctly
	useEffect(() => {
    if (assignTaskApiData) {
      dispatch(removePopup('assign task'))

      dispatch(setActionDone('assign task'))
    }
	}, [assignTaskApiData, dispatch])

  // handle create api errors
	useEffect(() => {
    if (assignTaskApiError === 'there is a task with the same name in this user tasks' ) {
      setNameError(`${currentMember.name} already has a task with the same name!`)
    } else if (assignTaskApiError) {
      console.log(assignTaskApiError)
    }
	}, [assignTaskApiError, apiCallAttempt, currentMember.name, dispatch])

  // handle clicking on date and time icons so each can open it corresponding picker
  const handleIconClick = (position) => {
    document.querySelector(`.${position}-date .MuiInputBase-root`).click()
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
      if (e.target.classList.contains('disc-input') && values.disc.length < 300) {
        setValues({ ...values, [e.target.name]: e.target.value + '\n' })
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    await fetchAssignTaskApi(currentProject._id, currentMember._id, {
      ...values,
      startAt: values.startAt.toISOString(),
      endAt: values.endAt.toISOString(),
    })

    setApiCallAttempt(prevAttempts => prevAttempts + 1)
  }

  const today = dayjs()
    .startOf('minute')
    .add(1, 'minutes')
  const minEndDateTime = today.isAfter(values.startAt) ? today : 
    dayjs(values.startAt)
      .startOf('minute')
      .add(1, 'minutes')

  useEffect(() => {
    if (values.startAt.isAfter(values.endAt) && !today.isAfter(values.startAt)) {
      const updatedEndAt = dayjs(values.startAt).startOf('minute').add(1, 'minute')
      setValues((oldValues) => ({
        ...oldValues,
        endAt: updatedEndAt
      }))
    }
    // eslint-disable-next-line
  }, [values.startAt])
    
  return (
    <form
      className='assign-task-popup'
      onSubmit={handleSubmit}
      onKeyDown={onKeyDownHandler}
    >
      <div className='popup-blue-heading' />

      <div  className='assign-task-heading'>
        <p>Assign task to {currentMember.name}</p>

        <CloseIcon
          className='close-assign-task'
          onClick={() => dispatch(removePopup('assign task'))}
        />
      </div>
      
      <div  className='assign-task-content'>
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
            {values.disc.length}/300
          </p>
        </div>

        <div className='assign-line-wrapper'>
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
                        newStartDate >= values.endAt
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
                    endAt: newEndDate < minEndDateTime ? minEndDateTime : newEndDate
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

        <div className='assign-popup-button-wrapper'>
          <button
            type='submit'
            className='assign-task-button'        
            disabled={assignTaskApiLoading}
          >
            Assign
          </button>
          
          <button
            type='button'
            className='cancel-assign-task-button'
            onClick={() => {dispatch(removePopup('assign task'))}}
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  )
}