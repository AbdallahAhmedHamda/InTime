import { useSelector } from 'react-redux'
import { useTransition, animated } from 'react-spring'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import '../css/components/ManageTask.css'

export default function AddTask() {
  const showPopup = useSelector((state) => state.navigation.currentPopup)

  // animate popup appearance
  const popupTransition = useTransition(showPopup, {
    from: { opacity: 0, top: '40%' },
    enter: { opacity: 1, top: '50%' },
    leave: { opacity: 0, top: '40%' },
    config: { duration: 300 }
  })

  return (
    <div>
      {popupTransition((style, item) => item && (
        <animated.div className="manage-popup" style={style}>
          <div className='manage-blue-heading'></div>

          <p className='manage-popup-title'>Add new task</p>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker 
              format="M/D/YYYY [at] h:m A"
              closeOnSelect={false}
              disableHighlightToday={true}
              disablePast={true}
            />
          </LocalizationProvider>
        </animated.div>
      ))}
    </div>
  )
}