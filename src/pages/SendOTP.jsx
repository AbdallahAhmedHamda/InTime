import { useDispatch } from 'react-redux'
import { removeAllPopups, setCurrentPage } from '../features/navigation/navigationSlice'
import { useState, useEffect, useRef } from 'react'
import OtpInput from 'react-otp-input'
import '../css/pages/SendOTP.css'

export default function SendOTP() {
  const dispatch = useDispatch()

  const [focusVerified, setFocusVerified] = useState(false)
  const [otp, setOtp] = useState('')

  const containerRef = useRef(null)
  const verifyRef = useRef(null)

  // change the current page so the app can rerender and update sidenav active icon and remove all popups
  useEffect(() => {
    dispatch(setCurrentPage('sendOTP'))
    dispatch(removeAllPopups())
    // eslint-disable-next-line
  }, [])

  //change the min-width for the page depending if there is a scroll or if there is not
  useEffect(() => {
    const adjustHeight = () => {
      if (containerRef.current) {
        const hasHorizontalScrollbar = document.body.scrollWidth > window.innerWidth
        if (hasHorizontalScrollbar) {
          containerRef.current.style.minHeight = `calc(100vh - 8px)`
        } else {
          containerRef.current.style.minHeight = '100vh'
        }
      }
    }

    adjustHeight()

    window.addEventListener('resize', adjustHeight)

    return () => {
      window.removeEventListener('resize', adjustHeight)
    }
  }, [containerRef])

  // click when the user presses enter on verify button
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && e.target.tagName === 'BUTTON') {
        verifyRef.current.click()
      }
    }

    document.body.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // focus verify if otp length is 4
  useEffect(() => {
    if (otp.length === 4 && focusVerified) {
      verifyRef.current.focus()
    }
  }, [otp, focusVerified])

  const handleSubmit = (e) => {
    e.preventDefault()

    console.log("verify")
  }
  
  return (
    <form
      className='send-otp-page-container'
      onSubmit={handleSubmit}
      ref={containerRef}
    >
      <img src={require("../assets/images/25496-[Converted] 2.png")} alt="send-otp-hero-img" className='send-otp-hero-img' />

      <p className='send-otp-page-disc'>
        <span className='send-otp-blue-text'>Enter OTP</span>
        Enter the OTP we just sent to you<br/>
      </p>

      <OtpInput
        containerStyle='otp-input-container'
        value={otp}
        onChange={(e) => {
          setOtp(e)
          setFocusVerified(false)
          if (document.activeElement === document.querySelector('.otp-input-container > input:last-child')) {
            setFocusVerified(true)
          }
        }}
        numInputs={4}
        renderInput={(props) => <input {...props} />}
        inputType='tel'
        shouldAutoFocus
      />
      
      <p className='send-otp-resend'>Resend OTP</p>

      <button type="submit" ref={verifyRef}>
        <p>Verify</p>
      </button>
    </form>
  )
}