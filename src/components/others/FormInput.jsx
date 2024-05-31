import { Link } from 'react-router-dom'
import { useState } from 'react'
import PhoneInput from 'react-phone-input-2'
import ShowPassword from '../../svg/others/ShowPassword'
import HidePassword from '../../svg/others/HidePassword'
import 'react-phone-input-2/lib/style.css'
import '../../css/components/FormInput.css'

export default function FormInput(props) {
  const [showPassword, setShowPassword] = useState(false)

  const togglePassword = () => {
    setShowPassword(!showPassword)
  }

  const { inputRef, label, errorMessage, onChange, id, showError, type, value, ...inputProps } = props

  return (
    <div className={`sign-form-input ${inputProps.name === 'password' && id === 2 && 'sign-in-password'}`}>
      <label htmlFor={inputProps.name}>{label}</label>

      <div className='form-input-container eye-container'>
        {
          inputProps.name !== 'phone' ?
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
          <PhoneInput
            inputClass={showError ? 'sign-form-error' : ''}
            country={'eg'}
            value={value}
            onChange={onChange}
            defaultMask='...............'
            inputProps={{
              id:inputProps.name,
              ref:inputRef,
              autoComplete:'off',
              spellCheck:'false',
              ...inputProps
            }}
          />
        }
        
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