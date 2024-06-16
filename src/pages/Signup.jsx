import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { removeAllPopups, setCurrentPage, setCurrentEmail, setCurrentPassword } from '../features/navigation/navigationSlice'
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import FormInput from '../components/others/FormInput'
import '../css/pages/Signup.css'
import { singupApi } from '../apis/authApi'

export default function Signup() {
  const navigate = useNavigate()

  const dispatch = useDispatch()

  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [disabled, setDisabled] = useState(false)

  const containerRef = useRef(null)

  // change the current page so the app can rerender and update sidenav active icon and remove all popups
  useEffect(() => {
    dispatch(setCurrentPage('signup'))
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

  const inputs = [
    {
      autoFocus: true,
      id: 1,
      name: 'name',
      type: 'text',
      errorMessage: "This shouldn't be empty!",
      label: 'Name',
      pattern: /.*\S+.*/,
      required: true,
    },
    {
      id: 2,
      name: 'email',
      type: 'email',
      errorMessage: 'This should be a valid email address!',
      label: 'Email',
      pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
      required: true,
    },
    {
      id: 3,
      name: 'phone',
      type: 'tel',
      errorMessage: "Phone must be valid and consits of 11 digits!",
      label: 'Phone',
      pattern: /^0\d{10}$/,
      required: true,
    },
    {
      id: 4,
      name: 'password',
      type: 'password',
      errorMessage:
      'Password should be at least 8 characters and include both upper and lowercase letters, 1 number and 1 special character (!, @, #, $, %, ^, &)!',
      label: 'Password',
      pattern: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&])[a-zA-Z0-9!@#$%^&]{8,}$/,
      required: true,
    },
    {
      id: 5,
      name: 'confirmPassword',
      type: 'password',
      errorMessage: "Passwords don't match!",
      label: 'Confirm Password',
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
    setErrors(newErrors)
    return valid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (validate()) {
      setDisabled(true)

      try {
        await singupApi(values)
        
        dispatch(setCurrentEmail(values.email))
        dispatch(setCurrentPassword(values.password))

        navigate('/sendOTP')
      } catch (error) {
        if (error.message === 'please enter a valid email') {
          setErrors(prevErrors => ({...prevErrors, email: inputs[1].errorMessage}))
        } else if (error.message === 'this email already exists') {
          setErrors(prevErrors => ({...prevErrors, email: 'This email already exists!'}))
        } else {
          console.error('Error in signing up:', error.message)
        }
      } finally {
        setDisabled(false)
      }
    }
  }

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }
  
  return (
    <div className='signup-page-container' ref={containerRef}>
      <form
        className='signup-page-left'
        onSubmit={handleSubmit}
        noValidate
      >
        <p>Sign up</p>

        {
          inputs.map((input) => (
            <FormInput
              key={input.id}
              {...input}
              errorMessage={errors[input.name]}
              value={values[input.name]}
              onChange={onChange}
              showError={!!errors[input.name]}
            />
          ))
        }

        <button type="submit" disabled={disabled}>Sign up</button>

        <p>Already have an account? <Link to='/signin' >Sign in</Link></p>
      </form>

      <div className='signup-page-right'>
        <img src={require('../assets/images/logo.png')} alt='intro-hero-img' className='signup-hero-img' />

        <p className='signup-app-logo-text'>
          In <span>Time</span>
        </p>

        <p className='signup-page-disc'>
          Task management & project<br/>
          management<br/>
        </p>
      </div>

    </div>
  )
}