import { useSelector, useDispatch } from 'react-redux'
import { addPopup, removePopup, setUncroppedProjectImage, setCroppedProjectImage, incrementRenderCount } from '../../features/navigation/navigationSlice'
import { useEffect, useState, useRef } from 'react'
import { createProjectApi } from '../../apis/pr'
import useApi from '../../hooks/useApi'
import CameraIcon from '../../svg/others/CameraIcon'
import CloseIcon from '../../svg/others/CloseIcon'
import '../../css/components/AddEditProject.css'

export default function AddProject() {
  const croppedImage = useSelector((state) => state.navigation.croppedProjectImage)

  const dispatch = useDispatch()

  const [values, setValues] = useState(
    {
      name: '',
      image: ''
    }
  )
  const [nameError, setNameError] = useState('')
  const [coverHovered, setCoverHovered] = useState(false)
  const [apiCallAttempt, setApiCallAttempt] = useState(0)

  const imageInputRef = useRef()

  const {
		fetchApi : fetchCreateProjectApi,
		apiData: createProjectApiData,
		apiError: createProjectApiError,
		apiLoading: createProjectApiLoading
	} = useApi(createProjectApi)

  // remove saved images from redux when popup unmounts
  useEffect(() => {
    return () => {
      dispatch(setUncroppedProjectImage(''))
      dispatch(setCroppedProjectImage(''))
    }
  }, [dispatch])

  // set project cover when its cropped
  useEffect(() => {
    if (croppedImage) {
      setValues(prevState => ({ ...prevState, image: croppedImage }))
    }
  }, [croppedImage])

  // close popup when project is added correctly
	useEffect(() => {
    if (createProjectApiData) {
      dispatch(removePopup('add project'))

      dispatch(incrementRenderCount())
    }
	}, [createProjectApiData, dispatch])

  // handle create api errors
	useEffect(() => {
    if (createProjectApiError === 'this name is already used' ) {
      setNameError('This project name already exists!')
    } else if (createProjectApiError) {
      console.log(createProjectApiError)
    }
	}, [createProjectApiError, apiCallAttempt, dispatch])

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

          if (naturalWidth < 283 || naturalHeight < 121) {
            dispatch(addPopup('small task cover'))
          } else if (sizeInMB > 3) {
            dispatch(addPopup('big size image'))
          } else {
            dispatch(addPopup('crop project cover'))
            dispatch(setUncroppedProjectImage(reader.result))
          }
        }
      }

      reader.readAsDataURL(file)
    }
  }

  const selectImage = () => {
    imageInputRef.current.click()
  }

  const onTextInputChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })

    if (e.target && e.target.name === 'name') {
      setNameError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    await fetchCreateProjectApi(values)

    setApiCallAttempt(prevAttempts => prevAttempts + 1)
  }
    
  return (
    <form
      className='add-project-popup'
      onSubmit={handleSubmit}
    >
      <div  className='add-project-heading'>
        <p>Create Project</p>

        <CloseIcon
          className='close-add-project'
          onClick={() => dispatch(removePopup('add project'))}
        />
      </div>
      
      <div  className='add-project-content'>
        <div className='add-project-input-block'>
          <input
            autoFocus
            spellCheck='false'
            autoComplete='off'
            required={true}
            pattern='.*\S+.*'
            title='Include other letters than space!'
            className='project-title-input'
            type='text'
            name='name'
            id='name'
            value={values.name}
            onChange={onTextInputChange}
            placeholder='Name'
            style={{
              outline: nameError ? '1px solid red' : '1px solid #000'
            }}
          />

          {nameError ? <p className='same-name-error'>{nameError}</p> : ''}
        </div>
        

        <div className='add-project-input-block add-project-cover-block-container'>
          <div className='optional-input-wrapper'>
            <p>Cover photo</p>
            
            <p className='optional-input'>(optional)</p>
          </div>

          <input
            type='file'
            id='cover'
            accept='image/png, image/jpeg'
            onChange={onImageSelection}
            hidden={true}
            ref={imageInputRef}
          />

          {
            !values.image ?
            <div className='project-cover-select' >
              <button type='button' onClick={selectImage}>
                Select Image
              </button>
            </div> :
            <div 
              className='project-cover-container'
              onMouseEnter={() => setCoverHovered(true)}
              onMouseLeave={() => setCoverHovered(false)}
            >
              <img 
                alt='cover' 
                src={values.image}
                className='project-cover-input'
              />
              {
                coverHovered ?
                <div>
                  <CloseIcon
                    className='project-cover-remove'
                    onClick={() => {
                      dispatch(setUncroppedProjectImage(''))
                      setValues({
                        ...values,
                        image: ''
                      })
                    }}
                  />

                  <CameraIcon selectImage={selectImage}/>
                </div> :
                ''
              }
            </div>
          }
        </div>

        <button
          type='submit'
          className='add-project-button'        
          disabled={createProjectApiLoading}
        >
          Create
        </button>
      </div>
    </form>
  )
}