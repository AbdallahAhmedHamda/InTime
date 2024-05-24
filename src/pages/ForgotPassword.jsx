import { useDispatch } from 'react-redux'
import { removeAllPopups, setCurrentPage } from '../features/navigation/navigationSlice'
import { useState, useEffect, useRef } from 'react'
import FormInput from '../components/others/FormInput'
import '../css/pages/ForgotPassword.css'

export default function ForgotPassword() {
  const dispatch = useDispatch()

  const [emailValue, setEmailValue] = useState('')

  const containerRef = useRef(null)

  // change the current page so the app can rerender and update sidenav active icon and remove all popups
  useEffect(() => {
    dispatch(setCurrentPage('forgotPassword'))
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

  const handleSubmit = (e) => {
    e.preventDefault()

    console.log("Send OTP")
  }
  
  return (
    <form
      className='forgot-password-page-container'
      onSubmit={handleSubmit}
      ref={containerRef}
    >
      <img src={require("../assets/images/3275432 1.png")} alt="forgot-password-hero-img" className='forgot-password-hero-img' />

      <p className='forgot-password-page-disc'>
        <span className='forgot-password-blue-text'>Forgot password ?</span>
        Enter your Email then we will send you OTP<br/>
        to reset new password
      </p>

      <FormInput
        name='email'
        type='text'
        placeholder='Email'
        required
        value={emailValue}
        onChange={(e) => setEmailValue(e.target.value)}
      />

      <button type="submit">Send OTP</button>
    </form>
  )
}