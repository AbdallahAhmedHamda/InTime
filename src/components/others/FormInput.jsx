import { Link } from 'react-router-dom'
import { useState } from 'react'
import ShowPassword from '../../svg/others/ShowPassword'
import HidePassword from '../../svg/others/HidePassword'
import '../../css/components/FormInput.css'

export default function FormInput(props) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword)
  }

  const { inputRef, label, errorMessage, onChange, id, showError, type, ...inputProps } = props

  return (
    <div className={`sign-form-input ${inputProps.name === 'password' && id === 2 && 'sign-in-password'}`}>
      <label htmlFor={inputProps.name}>{label}</label>

      <div className='form-input-container eye-container'>
        <input
          id={inputProps.name}
          ref={inputRef}
          type={
            type === 'password'
              ? showPassword
                ? 'text'
                :  'password'
              : type
          }
          autoComplete='off'
          spellCheck='false'
          {...inputProps}
          onChange={onChange}
          className={
            showError && type === 'password'
              ? 'sign-form-error form-password-input'
              : showError
                ? 'sign-form-error'
                : type === 'password'
                  ? 'form-password-input'
                  : ''
          }
        />
        
        {
          type === 'password' ?
          showPassword ?
          <ShowPassword togglePassword={togglePassword}/> :
          <HidePassword togglePassword={togglePassword}/> :
          ''
        }
      </div>
      {
        inputProps.name === 'password' && id === 2 && <Link to='/forgotPassword'>Forgot your password?</Link>
      }

      {
        showError && <span>{errorMessage}</span>
      }
    </div>
  )
}