import { useDispatch } from 'react-redux'
import { removeAllPopups, setCurrentPage } from '../features/navigation/navigationSlice'
import { useState, useEffect, useRef } from 'react'
import OtpInput from 'react-otp-input'
import '../css/pages/ResetPassword.css'
import FormInput from '../components/others/FormInput'

export default function ResetPassword() {
  const dispatch = useDispatch()

  const [focusNext, setFocusNext] = useState(false)
  const [otp, setOtp] = useState('')
  const [values, setValues] = useState({
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})

  const containerRef = useRef(null)
  const nextInputRef = useRef(null)

  // change the current page so the app can rerender and update sidenav active icon and remove all popups
  useEffect(() => {
    dispatch(setCurrentPage('resetPassword'))
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
        nextInputRef.current.click()
      }
    }

    document.body.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // focus verify if otp length is 4
  useEffect(() => {
    if (otp.length === 4 && focusNext) {
      nextInputRef.current.focus()
    }
  }, [otp, focusNext])

  const inputs = [
    {
      id: 1,
      name: 'password',
      type: 'password',
      errorMessage:
        'Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!',
      placeholder: 'Password',
      pattern: /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/,
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
        newErrors[input.name] = input.errorMessage
      } else if (input.pattern && !input.pattern.test(values[input.name])) {
        valid = false
        newErrors[input.name] = input.errorMessage
      } else if (input.name === 'confirmPassword' && values[input.name] !== values.password) {
        valid = false
        newErrors[input.name] = input.errorMessage
      }
    })
    setErrors(newErrors)
    return valid
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      console.log("Form submitted")
    }
  }

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
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
        renderInput={(props) => <input {...props} />}
        inputType='tel'
        shouldAutoFocus
      />

      <p className='reset-password-resend'>Resend OTP</p>

      {
        inputs.map((input) => (
          <FormInput
            key={input.id}
            {...input}
            value={values[input.name]}
            onChange={onChange}
            showError={!!errors[input.name]}
            inputRef={input.name === 'password' && input.id === 1 ? nextInputRef : null}
          />
        ))
      }

      <button type="submit">Verify</button>
    </form>
  )
}