import { useDispatch } from 'react-redux'
import { removeAllPopups, setCurrentPage } from '../features/navigation/navigationSlice'
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import FormInput from '../components/others/FormInput'
import '../css/pages/Signup.css'

export default function Signup() {
  const dispatch = useDispatch()

  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})

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
      errorMessage: 'Include other letters than space!',
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
      label: 'Phone',
      errorMessage: "This can't be empty!",
      pattern: null,
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
    const name = e.target ? e.target.name : 'phone'
    const value = e.target ? e.target.value : e

    setValues({ ...values, [name]: value })
    setErrors({ ...errors, [name]: '' })

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
              value={values[input.name]}
              onChange={onChange}
              showError={!!errors[input.name]}
            />
          ))
        }

        <button type="submit">Sign up</button>

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