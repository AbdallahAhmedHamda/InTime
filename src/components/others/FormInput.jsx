import { Link } from 'react-router-dom'
import { useState } from 'react'
import ShowPassword from '../../svg/others/ShowPassword'
import HidePassword from '../../svg/others/HidePassword'
import '../../css/components/FormInput.css'

export default function FormInput(props) {
  const [showPassword, setShowPassword] = useState(false)

  const togglePassword = () => {
    setShowPassword(!showPassword)
  }
  
  const { pattern, inputRef, label, errorMessage, onChange, id, showError, type, value, ...inputProps } = props
  return (
    <div
      className={`sign-form-input ${inputProps.name === 'password' && id === 2 ? 'sign-in-password' : ''}`}
    >
      <label htmlFor={inputProps.name}>{label}</label>

      <div className='form-input-container eye-container'>
        {
          inputProps.name !== 'about' ?
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
          autoComplete='on'
          spellCheck='false'
          maxLength={inputProps.name === 'phone' ? '11' : ''}
          {...inputProps}
          value={value}
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
          /> :
          <textarea
            id={inputProps.name}
            ref={inputRef}
            {...inputProps}
            value={value}
            onChange={onChange}
            maxLength='300'
            autoComplete='off'
            autoCorrect='off'
            autoCapitalize='off'
            spellCheck='false'
            data-gramm='false'
            data-gramm_editor='false'
            data-enable-grammarly='false'
          />
        }

        {
          inputProps.name === 'about' ?
          <p className='about-max-letters'>
            {value.length}/300
          </p> :
          ''
        }

        {
          type === 'password' ?
          showPassword ?
          <ShowPassword togglePassword={togglePassword}/> :
          <HidePassword togglePassword={togglePassword}/> :
          ''
        }

      </div>

      <div className='under-form-input-container'>       
        {
          showError && <span>{errorMessage}</span>
        }

        {
          inputProps.name === 'password' && id === 2 && <Link to='/forgotPassword'>Forgot your password?</Link>
        }
      </div>
    </div>
  )
}