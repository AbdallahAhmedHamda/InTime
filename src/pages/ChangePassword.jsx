import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { removeAllPopups, setCurrentPage } from '../features/navigation/navigationSlice'
import { useState, useEffect, useRef } from 'react'
import { changePasswordApi } from '../apis/userApi'
import useApi from '../hooks/useApi'
import FormInput from '../components/others/FormInput'
import '../css/pages/ChangePassword.css'

export default function ChangePassword() {
  const navigate = useNavigate()

  const dispatch = useDispatch()

  const [values, setValues] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  })
  const [errors, setErrors] = useState({})

  const containerRef = useRef(null)

  const {
		fetchApi : fetchChangePasswordApi,
		apiData: changePasswordApiData,
		apiError: changePasswordApiError,
		apiLoading: changePasswordApiLoading
	} = useApi(changePasswordApi)

  // change the current page so the app can rerender and update sidenav active icon and remove all popups
  useEffect(() => {
    dispatch(setCurrentPage('changePassword'))
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

  // navigate to settings on success
	useEffect(() => {
    if (changePasswordApiData?.success) {
      navigate('/settings')
		}
  }, [changePasswordApiData, navigate])

  // show errors
	useEffect(() => {
    if (changePasswordApiError) {
      if (changePasswordApiError === 'wrong password') {
        setErrors(prevErrors => ({...prevErrors, oldPassword: 'The password you entered is incorrect!'}))
      } else if (changePasswordApiError === '"newPassword" contains an invalid value') {
        setErrors(prevErrors => ({...prevErrors, newPassword: 'Your new and old passwords must be different!'}))
      } else {
        console.error('Error in changing password:', changePasswordApiError)
      }
		}
  }, [changePasswordApiError]) 

  const inputs = [
    {
      autoFocus: true,
      id: 1,
      name: 'oldPassword',
      type: 'password',
      placeholder: 'Old Password',
      pattern: null,
      required: true,
    },
    {
      id: 2,
      name: 'newPassword',
      type: 'password',
      errorMessage:
      'Password should be at least 8 characters and include both upper and lowercase letters, 1 number, 1 special character (!, @, #, $, %, ^, &) and not contain spaces!',
      placeholder: 'New Password',
      pattern: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&])[a-zA-Z0-9!@#$%^&]{8,}$/,
      required: true,
    },
    {
      id: 3,
      name: 'confirmNewPassword',
      type: 'password',
      errorMessage: "Passwords don't match!",
      placeholder: 'Confirm New Password',
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
      } else if (input.name === 'confirmNewPassword' && values[input.name] !== values.newPassword) {
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
      fetchChangePasswordApi(values)
    }
  }

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }
  
  return (
    <form
      className='change-password-page-container'
      onSubmit={handleSubmit}
      ref={containerRef}
      noValidate
    >
      <img src={require("../assets/images/25496-[Converted] 1.png")} alt="change-password-hero-img" className='change-password-hero-img' />

      <p className='change-password-page-disc'>
        Change Password
      </p>

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

      <button type="submit" disabled={changePasswordApiLoading}>Verify</button>
    </form>
  )
}