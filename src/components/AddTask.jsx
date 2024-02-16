import { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker'
import dayjs from 'dayjs'
import Select from 'react-select'
import { setCurrentPopup } from '../features/navigation/navigationSlice'
import '../css/components/AddTask.css'
import calendarIcon from '../assets/images/calendar-icon.png'
import CameraIcon from '../svg/others/CameraIcon'
import FlagIcon from '../svg/others/FlagIcon'
import CoverRemove from '../svg/others/CoverRemove'

const options = [
  {
    value: "1",
    label: <FlagIcon priority={1} />
  },
  {
    value: "2",
    label: <FlagIcon priority={2} />
  },
  {
    value: "3",
    label: <FlagIcon priority={3} />
  },
  {
    value: "4",
    label: <FlagIcon priority={4} />
  }
]

export default function AddTask() {
  const showPopup = useSelector((state) => state.navigation.currentPopup)

  const dispatch = useDispatch()

  const [values, setValues] = useState({
    title: '',
    disc: '',
    tag: '',
    flag: options[0],
    image: '',
    startDate: dayjs().add(30 - dayjs().minute() % 30, 'minutes'),
    endDate: dayjs().add(90 - dayjs().minute() % 30, 'minutes'),
    steps: []
  })

  const [coverHovered, setCoverHovered] = useState(false)

  const imageInputRef = useRef()

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
  const onInputChange = (event) => {
    setValues({...values, [event.target.name]: event.target.value})
  }

  // handle image selection
  const onImageSelection = (event) => {
    const file = event.target.files[0]

    if (!file?.type.startsWith('image/')) {
      console.log('please Choose an Image!')
    } else {
      const reader = new FileReader()

      reader.onloadend = () => {
        setValues({...values, image: reader.result})
      }

      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    dispatch(setCurrentPopup(''))
  }

  const selectImage = () => {
    imageInputRef.current.click()
  }
    
  return (
    <form className='add-popup'>
      <div className='popup-blue-heading' />

      <div  className="add-content">
        <p className='add-heading'>Add new task</p>

        <div className='input-block'>
          <p>Title</p>

          <input
            className='task-title-input'
            type='text'
            name='title'
            value={values.title}
            onChange={onInputChange}
            placeholder='Enter a title....'
          />
        </div>

        <div className='input-block'>
          <p>Description</p>

          <textarea
            className='disc-input'
            name='disc'
            value={values.disc}
            onChange={onInputChange}
            placeholder='Add description....'
          />
        </div>

        <div className='third-line-wrapper'>
          <div className='input-block'>
            <p>Cover photo</p>

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
                <CoverRemove
                  className='task-cover-remove'
                  removeCover={() =>{
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
              className='tag-input'
              type='text'
              name='tag'
              value={values.tag}
              onChange={onInputChange}
              placeholder='Add tag...'
            />
          </div>

          <div className='input-block'>
            <p>Flag</p>

            <Select
              isSearchable={false}
              options={options}
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 210}), option: (base) => ({ ...base, display: 'flex', cursor: 'pointer' }) }}
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
                  })}
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

        <button onClick={handleSubmit}></button>
      </div>

    </form>
  )
}