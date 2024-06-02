import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { removeAllPopups, setCurrentEmail, setCurrentPage } from '../features/navigation/navigationSlice'
import { useState, useEffect, useRef } from 'react'
import OtpInput from 'react-otp-input'
import '../css/pages/SendOTP.css'

export default function SendOTP() {
  const navigate = useNavigate()

  const dispatch = useDispatch()

  const currentEmail = useSelector((state) => state.navigation.currentEmail)

  const [focusVerified, setFocusVerified] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [timer, setTimer] = useState(0)
  const [error, setError] = useState('')
  const [otp, setOtp] = useState('')

  const containerRef = useRef(null)
  const verifyRef = useRef(null)
  const resendRef = useRef(null)

  // change the current page so the app can rerender and update sidenav active icon and remove all popups
  useEffect(() => {
    dispatch(setCurrentPage('sendOTP'))
    dispatch(removeAllPopups())
  }, [dispatch])

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

  // calculate timer start
  useEffect(() => {
    const savedTimestamp = localStorage.getItem('sendOtpTimestamp')
    if (savedTimestamp) {
      const elapsedTime = Math.floor((Date.now() - savedTimestamp) / 1000)
      const remainingTime = Math.max(30 - elapsedTime, 0)

      setTimer(remainingTime)

      if (remainingTime > 0) {
        resendRef.current.classList.add('send-otp-disabled')
      } else {
        resendRef.current.classList.remove('send-otp-disabled')
        localStorage.removeItem('sendOtpTimestamp')
      }
    }
  }, [])

  // resend countdown
  useEffect (() => {
    let countdown
    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer((prevTimer) => {
          const newTimer = prevTimer - 1

          if (newTimer === 0) {
            clearInterval(countdown)
            localStorage.removeItem('sendOtpTimestamp')
            resendRef.current.classList.remove('send-otp-disabled')
          }

          return newTimer
        })
      }, 1000)
    }

    return () => clearInterval(countdown)
  }, [timer])

  const handleSubmit = (e) => {
    e.preventDefault()

    setDisabled(true)
    
    fetch(`https://intime-9hga.onrender.com/api/v1/auth/activation/${otp}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: currentEmail
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setDisabled(false)

        if (data.message === 'cant find this page') {
          setError('Please enter an OTP!')
        } else if (data.message === 'Invalid OTP') {
          setError('Invalid OTP!')
        } else if (data.message === 'this account is now active') {
          dispatch(setCurrentEmail(''))
          
          localStorage.setItem('accessToken', data.accessToken)
          localStorage.setItem('refreshToken', data.refreshToken)
          
          navigate('/home')
        } else {
          console.log(data)
        }
      })
      .catch((error) => {
        setDisabled(false)
        
        console.error('Error in submitting:', error)
      })
  }

  const disableResend = (e) => {
    e.preventDefault()

    if (!resendRef.current.classList.contains('send-otp-disabled')) {
      resendRef.current.classList.add('send-otp-disabled')

      setTimer(30)

      localStorage.setItem('sendOtpTimestamp', Date.now())

      fetch('https://intime-9hga.onrender.com/api/v1/auth/resendactivationcode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: currentEmail,
        }),
      })
        .then((response) => response.json())
        .then((data) => {  
          console.log(data.message)
        })
        .catch((error) => {          
          console.error('Error in resending:', error)
        })
    }
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
          setError('')
          setFocusVerified(false)
          if (document.activeElement === document.querySelector('.otp-input-container > input:last-child')) {
            setFocusVerified(true)
          }
        }}
        numInputs={4}
        renderInput={(props, i) => <input
          {...props}
          id={`otpInputNum${i}`}
        />}
        inputType='tel'
        shouldAutoFocus
      />

      <p className={`send-otp-resend ${timer ? 'send-otp-disabled' : ''}`} onClick={disableResend} ref={resendRef}>Resend OTP{timer ? ' in ' : ''}{timer ? timer : ''}{timer ? 's' : ''}</p>

      <button type="submit" disabled={disabled} ref={verifyRef}>
        <p>Verify</p>
      </button>

      {error ? <p className='send-otp-error'>{error}</p> : ''}
    </form>
  )
}