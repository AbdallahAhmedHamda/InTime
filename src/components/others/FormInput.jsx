import { Link } from 'react-router-dom'
import "../../css/components/FormInput.css"

export default function FormInput(props) {
  const { inputRef, label, errorMessage, onChange, id, showError, ...inputProps } = props

  return (
    <div className={`sign-form-input ${inputProps.name === 'password' && id === 2 && 'sign-in-password'}`}>
      <label>{label}</label>
      <input
        ref={inputRef}
        autoComplete="off"
        {...inputProps}
        onChange={onChange}
        className={showError ? "sign-form-error" : ""}
      />
      {inputProps.name === 'password' && id === 2 && <Link to='/forgotPassword'>Forgot your password?</Link>}
      {showError && <span>{errorMessage}</span>}
    </div>
  )
}