import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { removeAllPopups, setCurrentEmail, setCurrentPage } from '../features/navigation/navigationSlice'
import { useState, useEffect, useRef } from 'react'
import FormInput from '../components/others/FormInput'
import '../css/pages/ForgotPassword.css'

export default function ForgotPassword() {
  const navigate = useNavigate()

  const dispatch = useDispatch()

  const [emailValue, setEmailValue] = useState('')
  const [emailError, setEmailError] = useState('')
  const [error, setError] = useState(false)
  const [disabled, setDisabled] = useState('')

  const containerRef = useRef(null)

  // change the current page so the app can rerender and update sidenav active icon and remove all popups
  useEffect(() => {
    dispatch(setCurrentPage('forgotPassword'))
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

  const handleSubmit = (e) => {
    e.preventDefault()

    setDisabled(true)
    
    fetch('https://intime-9hga.onrender.com/api/v1/auth/forgetpassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: emailValue,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setDisabled(false)

        if (data.message === 'user not registered') {
          setEmailError("This email doesn't exist")
        } else if (data.message === 'you have to activate the account first') {
          setError(true)
        } else if (data.success) {
          dispatch(setCurrentEmail(emailValue))

          navigate('/resetPassword')
        } else {
          console.log(data)
        }
      })
      .catch((error) => {        
        console.error('Error in submitting:', error)
      })
  }

  const sendOTP = (e) => {    
    e.preventDefault()

    fetch('https://intime-9hga.onrender.com/api/v1/auth/resendactivationcode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: emailValue
      }),
    })
      .then((response) => response.json())
      .then((data) => {  
          console.log(emailValue)
        if (data.message === 'code sent') {
          dispatch(setCurrentEmail(emailValue))

          navigate('/sendOTP')
        } else {
          console.log(data)
        }
      })
      .catch((error) => {          
        console.error('Error in sending otp:', error)
      })
  }
  
  return (
    <form
      className='forgot-password-page-container'
      onSubmit={handleSubmit}
      ref={containerRef}
    >
      <img src={require("../assets/images/3275432 1.png")} alt="forgot-password-hero-img" className='forgot-password-hero-img' />

      <p className='forgot-password-page-disc'>
        <span className='forgot-password-blue-text'>Forgot password?</span>
        Enter your Email then we will send you OTP<br/>
        to reset new password
      </p>

      <FormInput
        name='emailValue'
        type='email'
        placeholder='Email'
        required
        value={emailValue}
        autoFocus
        onChange={(e) => {
          setEmailValue(e.target.value)
          setEmailError('')
          setError('')
        }}
        errorMessage={emailError}
        showError={!!emailError}
      />

      <button type="submit" disabled={disabled}>Send OTP</button>

      {error ? <p className='forgot-password-error'>Your account is not activated! <Link onClick={sendOTP}>Click here</Link>  To activate it. </p> : ''}
    </form>
  )
}