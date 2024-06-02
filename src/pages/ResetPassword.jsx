import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { removeAllPopups, setCurrentEmail, setCurrentPage } from '../features/navigation/navigationSlice'
import { useState, useEffect, useRef } from 'react'
import OtpInput from 'react-otp-input'
import FormInput from '../components/others/FormInput'
import '../css/pages/ResetPassword.css'

export default function ResetPassword() {
  const navigate = useNavigate()

  const dispatch = useDispatch()
  
  const currentEmail = useSelector((state) => state.navigation.currentEmail)

  const [focusNext, setFocusNext] = useState(false)
  const [timer, setTimer] = useState(0)
  const [otp, setOtp] = useState('')
  const [values, setValues] = useState({
    password: '',
    confirmPassword: '',
  })
  const [apiError, setApiError] = useState()
  const [inputErrors, setInputErrors] = useState({})
  const [disabled, setDisabled] = useState(false)


  const containerRef = useRef(null)
  const nextInputRef = useRef(null)
  const resendRef = useRef(null)

  // change the current page so the app can rerender and update sidenav active icon and remove all popups
  useEffect(() => {
    dispatch(setCurrentPage('resetPassword'))
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

  // focus verify if otp length is 4
  useEffect(() => {
    if (otp.length === 4 && focusNext) {
      nextInputRef.current.focus()
    }
  }, [otp, focusNext])

  // calculate timer start
  useEffect(() => {
    const savedTimestamp = localStorage.getItem('resetPasswordTimestamp')
    if (savedTimestamp) {
      const elapsedTime = Math.floor((Date.now() - savedTimestamp) / 1000)
      const remainingTime = Math.max(30 - elapsedTime, 0)

      setTimer(remainingTime)

      if (remainingTime > 0) {
        resendRef.current.classList.add('reset-password-disabled')
      } else {
        resendRef.current.classList.remove('reset-password-disabled')
        localStorage.removeItem('resetPasswordTimestamp')
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
            localStorage.removeItem('resetPasswordTimestamp')
            resendRef.current.classList.remove('reset-password-disabled')
          }

          return newTimer
        })
      }, 1000)
    }

    return () => clearInterval(countdown)
  }, [timer])

  const inputs = [
    {
      id: 1,
      name: 'password',
      type: 'password',
      errorMessage:
        'Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!',
      placeholder: 'Password',
      pattern: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&])[a-zA-Z0-9!@#$%^&]{8,}$/,
      required: true,
    },
    {
      id: 2,
      name: 'confirmPassword',
      type: 'password',
      errorMessage: "Passwords don't match!",
      placeholder: 'Confirm Password',
      pattern: null,
      required: true,
    },
  ]

  const validate = () => {
    let valid = true
    let newErrors = {}

    inputs.forEach((input) => {
      if (input.required && !values[input.name]) {
        valid = false
        newErrors[input.name] = "This shouldn't be empty"
      } else if (input.pattern && !input.pattern.test(values[input.name])) {
        valid = false
        newErrors[input.name] = input.errorMessage
      } else if (input.name === 'confirmPassword' && values[input.name] !== values.password) {
        valid = false
        newErrors[input.name] = input.errorMessage
      }
    })
    setInputErrors(newErrors)
    return valid
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      setDisabled(true)
    
      fetch(`https://intime-9hga.onrender.com/api/v1/auth/forgetpassword/changepassword/${otp}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: values.password,
          confirmPassword: values.confirmPassword,
          email: currentEmail
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setDisabled(false)
  
          if (data.message === 'cant find this page') {
            setApiError('Please enter an OTP!')
          } else if (data.message === 'Invalid OTP') {
            setApiError('Invalid OTP!')
          } else if (data.message === 'password must be unique') {
            setInputErrors(prevErrors => ({...prevErrors, password: 'Please enter a different password than your already existing one!'}))
          } else if (data.message === 'password changed') {
            dispatch(setCurrentEmail(''))

            navigate('/signin')
          } else  {
            console.log(data)
          }
        })
        .catch((error) => {
          setDisabled(false)
          
          console.error('Error in resetting:', error)
        })
    }
  }

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
    setInputErrors({ ...inputErrors, [e.target.name]: '' })
  }

  const disableResend = (e) => {
    e.preventDefault()

    if (!resendRef.current.classList.contains('reset-password-disabled')) {
      resendRef.current.classList.add('reset-password-disabled')

      setTimer(30)

      localStorage.setItem('resetPasswordTimestamp', Date.now())

      fetch('https://intime-9hga.onrender.com/api/v1/auth/forgetpassword', {
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
          console.log(data)
        })
        .catch((error) => {          
          console.error('Error in resending:', error)
        })
    }
  }
  
  return (
    <form
      className='reset-password-page-container'
      onSubmit={handleSubmit}
      ref={containerRef}
      noValidate
    >
      <img src={require("../assets/images/25496-[Converted] 1.png")} alt="reset-password-hero-img" className='reset-password-hero-img' />

      <p className='reset-password-page-disc'>
        <span className='reset-password-blue-text'>Reset Password</span>
        Enter the OTP we just sent to you<br/>
      </p>

      <OtpInput
        containerStyle='reset-otp-input-container'
        value={otp}
        onChange={(e) => {
          setOtp(e)
          setFocusNext(false)
          if (document.activeElement === document.querySelector('.reset-otp-input-container > input:last-child')) {
            setFocusNext(true)
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

      <p className={`reset-password-resend ${timer ? 'reset-password-disabled' : ''}`} onClick={disableResend} ref={resendRef}>Resend OTP{timer ? ' in ' : ''}{timer ? timer : ''}{timer ? 's' : ''}</p>

      {
        inputs.map((input) => (
          <FormInput
            key={input.id}
            {...input}
            errorMessage={inputErrors[input.name]}
            value={values[input.name]}
            onChange={onChange}
            showError={!!inputErrors[input.name]}
            inputRef={input.name === 'password' && input.id === 1 ? nextInputRef : null}
          />
        ))
      }

      <button type="submit" disabled={disabled}>Verify</button>

      {apiError ? <p className='reset-password-error'>{apiError}</p> : ''}
    </form>
  )
}