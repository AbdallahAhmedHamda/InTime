import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { removeAllPopups, setCurrentPage, setCurrentEmail, setIsAuthenticated, setCurrentPassword } from '../features/navigation/navigationSlice'
import { useState, useEffect, useRef } from 'react'
import { loginApi, resendActivationApi } from '../apis/authApi'
import FormInput from '../components/others/FormInput'
import '../css/pages/Signin.css'

export default function Signin() {
  const navigate = useNavigate()
  
  const dispatch = useDispatch()

  const [values, setValues] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [disabled, setDisabled] = useState(false)

  const containerRef = useRef(null)

  // change the current page so the app can rerender and update sidenav active icon and remove all popups
  useEffect(() => {
    dispatch(setCurrentPage('signin'))
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
      name: 'email',
      type: 'email',
      label: 'Your email',
      required: true,
    },
    {
      id: 2,
      name: 'password',
      type: 'password',
      label: 'Your password',
      required: true,
    }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()

    setDisabled(true)

    try {
      const data = await loginApi(values)
      
      dispatch(setCurrentEmail(''))
      dispatch(setCurrentPassword(''))

      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)

      dispatch(setIsAuthenticated(true))

      navigate('/home')
    } catch (signinError) {
      if (signinError.message === 'user not registered') {
        setErrors(prevErrors => ({...prevErrors, email: "This email doesn't exist"}))
      } else if (signinError.message === 'wrong password') {
        setErrors(prevErrors => ({...prevErrors, password: 'The password you entered is incorrect!'}))
      } else if (signinError.message === 'you have to activate your account first') {
        try {
          await resendActivationApi(values.email)
        
          dispatch(setCurrentEmail(values.email))
          dispatch(setCurrentPassword(values.password))

          navigate('/sendOTP')
        } catch (activationError) {
          console.error('Error in resending otp:', activationError.message)
        }
      } else {
        console.error('Error in signing in:', signinError.message)
      }
    } finally {
      setDisabled(false)
    }
  }

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  console.log()
  
  return (
    <div className='signin-page-container' ref={containerRef}>
      <form
        className='signin-page-left'
        onSubmit={handleSubmit}
      >
        <p>Sign in</p>

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

        <button type="submit" disabled={disabled}>Log in</button>

        <p>Don't have an account? <Link to='/signup' >Sign up</Link></p>
      </form>

      <div className='signin-page-right'>
        <img src={require('../assets/images/logo.png')} alt='intro-hero-img' className='signin-hero-img' />

        <p className='signin-app-logo-text'>
          In <span>Time</span>
        </p>

        <p className='signin-page-disc'>
          Task management & project<br/>
          management<br/>
        </p>
      </div>
    </div>
  )
}