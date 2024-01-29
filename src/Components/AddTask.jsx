import { useSelector } from 'react-redux';
import { useTransition, animated } from 'react-spring';
import '../CSS/Components/ManageTask.css'

export default function AddTask() {
  const showPopup = useSelector((state) => state.navigation.currentPopup)

  // animate account dropdown
  const popupTransition = useTransition(showPopup, {
    from: { opacity: 0, top: '40%' },
    enter: { opacity: 1, top: '50%' },
    leave: { opacity: 0, top: '40%' },
    config: { duration: 300 }
  })

  return (
    <div>
      {popupTransition((style, item) => item && (
        <animated.div className="manage-popup" style={style}>jk</animated.div>
      ))}
    </div>
  )
}