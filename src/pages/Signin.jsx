import { useDispatch } from 'react-redux'
import { removeAllPopups, setCurrentPage } from '../features/navigation/navigationSlice'
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import FormInput from '../components/others/FormInput'
import '../css/pages/Signin.css'

export default function Signin() {
  const dispatch = useDispatch()

  const [values, setValues] = useState({
    email: '',
    password: '',
  })
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

  const handleSubmit = (e) => {
    e.preventDefault()

    setDisabled(true)
    fetch('https://intime-9hga.onrender.com/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    })
      .then((response) => response.json())
      .then((data) => {
        setDisabled(false);

        console.log(data)
      })
      .catch((error) => {
        setDisabled(false);
        
        console.error('Error in sign in:', error)
      })
  }

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }
  
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
              value={values[input.name]}
              onChange={onChange}
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