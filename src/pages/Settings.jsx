import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentPage, removeAllPopups, setUncroppedProfilePic, setCroppedProfilePic, addPopup } from '../features/navigation/navigationSlice'
import { setName, setPhone, setProfilePic, setTitle, setAbout } from '../features/user/userSlice'
import { useEffect, useState, useRef } from 'react'
import { updateUserApi, deleteProfilePicApi } from '../apis/userApi'
import useApi from '../hooks/useApi'
import FormInput from '../components/others/FormInput'
import '../css/pages/Settings.css'

export default function Settings() {
  const dispatch = useDispatch()
  
  const croppedImage = useSelector((state) => state.navigation.croppedProfilePic)
  const emailValue = useSelector((state) => state.user.email)

  const [values, setValues] = useState(
    {
      name: useSelector((state) => state.user.name),
      title: useSelector((state) => state.user.title),
      phone: useSelector((state) => state.user.phone),
      about: useSelector((state) => state.user.about),
      profilePic: useSelector((state) => state.user.profilePic)
    }
  )
  const [errors, setErrors] = useState({})

  const imageInputRef = useRef()

  const {
		fetchApi : fetchUpdateUserApi,
		apiData: updateUserApiData,
		apiError: updateUserApiError,
		apiLoading: updateUserApiLoading
	} = useApi(updateUserApi)

  const {
		fetchApi : fetchDeleteProfilePicApi,
		apiError: deleteProfilePicApiError
	} = useApi(deleteProfilePicApi)

  // change the current page so the app can rerender and update sidenav active icon and remove all popups and remove saved images from redux when page changes
  useEffect(() => {
    dispatch(setCurrentPage('settings'))
    dispatch(removeAllPopups())

    return () => {
      dispatch(setUncroppedProfilePic(''))
      dispatch(setCroppedProfilePic(''))
    }
  }, [dispatch])

  // change the account data when the api loads
	useEffect(() => {
    if (updateUserApiData) {
      dispatch(setName(values.name))
      dispatch(setPhone(values.phone))
      dispatch(setTitle(values.title))
      dispatch(setAbout(values.about))
      dispatch(setProfilePic(values.profilePic))
    }
    // eslint-disable-next-line
  }, [updateUserApiData, dispatch])

  // set profile pic when its cropped
  useEffect(() => {
    if (croppedImage) {
      setValues(prevState => ({ ...prevState, profilePic: croppedImage }))
    }
  }, [croppedImage])

  const inputs = [
    {
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
      name: 'title',
      type: 'text',
      label: 'Title',
      pattern: null,
      required: false,
    },
    {
      readOnly: true,
      id: 3,
      name: 'email',
      type: 'email',
      label: 'Email',
      pattern: null,
    },
    {
      id: 4,
      name: 'phone',
      type: 'tel',
      errorMessage: "Phone must be valid and consits of 11 digits!",
      label: 'Phone',
      pattern: /^0\d{10}$/,
      required: true,
    },
    {
      id: 5,
      name: 'about',
      type: 'text',
      label: 'About me',
      pattern: null,
      required: false,
    }
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
      const fetchApis = async () => {

        if (values.profilePic === '') {
          await fetchDeleteProfilePicApi()
        }

        await fetchUpdateUserApi(values)
      }

      fetchApis()
    }
  }

  // handle image selection
  const onImageSelection = (e) => {
    const file = e.target.files[0]
    const sizeInMB = file.size / 1024 / 1024
    e.target.value = null

    if (!file?.type.startsWith('image/')) {
      dispatch(addPopup('not image'))
    } else {
      const reader = new FileReader()

      reader.onload = () => {
        const img = new Image()
        img.src = reader.result

        img.onload = (e) => {
          const { naturalWidth, naturalHeight } = e.currentTarget

          if (naturalWidth < 170 || naturalHeight < 170) {
            dispatch(addPopup('small profile pic'))
          } else if (sizeInMB > 3) {
            dispatch(addPopup('big size image'))
          } else {
            dispatch(addPopup('crop profile pic'))
            dispatch(setUncroppedProfilePic(reader.result))
          }
        }
      }

      reader.readAsDataURL(file)
    }
  }

  const onKeyDownHandler = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (e.target.tagName.toLowerCase() === 'textarea' && values.about.length < 300) {
        setValues({ ...values, [e.target.name]: e.target.value + '\n' })
      }
    }
  }

  const selectImage = () => {
    imageInputRef.current.click()
  }

  const removeImage = () => {
    setValues(prevState => ({ ...prevState, profilePic: '' }))
  }

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const deleteAccount = () => {
    dispatch(addPopup('verify account deletion'))
  }

  if (updateUserApiError) {
		console.log(updateUserApiError)
	}

	if (deleteProfilePicApiError) {
		console.log(deleteProfilePicApiError)
	}

  return (
    <div className='main-content'>
      <p className='page-name'>Settings</p>

      <form
        className='settings-container'
        onSubmit={handleSubmit}
        onKeyDown={onKeyDownHandler}
        noValidate
      >
        <div className='settings-left-section'>
          <div className='settings-left-upper-section'>
            <input
              type='file'
              id='profilePic'
              accept='image/png, image/jpeg'
              onChange={onImageSelection}
              hidden={true}
              ref={imageInputRef}
            />

            <div 
              className='settings-profile-pic-container'
            >
              <img 
                alt='profilePic' 
                src={ values.profilePic ? values.profilePic : require('../assets/images/profile-pic.jpeg')}
                className='settings-profile-pic-input'
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = require('../assets/images/profile-pic.jpeg')
                }}
              />
            </div>

            <div className='settings-profile-pic-buttons-container'>
              <button type='button' onClick={selectImage} className='settings-profile-pic-upload'>
                Upload New
              </button>

              <button type='button' onClick={removeImage} className='settings-profile-pic-delete'>
                Remove
              </button>
            </div>
          </div>

          <div className='settings-left-bottom-section'>
            <button type='button' onClick={deleteAccount} className='settings-delete-account'>
              Delete Account
            </button>

            <Link to='/changePassword' className='settings-change-password'>
              Change Password
            </Link>
          </div>
        </div>

        <div className='settings-right-section'>
          {
            inputs.map((input) => (
              input.name !== 'email' ?
              <FormInput
                key={input.id}
                {...input}
                errorMessage={errors[input.name]}
                value={values[input.name]}
                onChange={onChange}
                showError={!!errors[input.name]}
              /> :
              <FormInput
                key={input.id}
                {...input}
                value={emailValue}
              /> 
            ))
          }

          <button type='submit' disabled={updateUserApiLoading}>Save</button>

        </div>
      </form>
    </div>
  )
}