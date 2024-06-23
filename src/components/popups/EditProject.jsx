import { useSelector, useDispatch } from 'react-redux'
import { addPopup, removePopup, setUncroppedProjectImage, setCroppedProjectImage, setCurrentProject, setActionDone } from '../../features/navigation/navigationSlice'
import { useEffect, useState, useRef } from 'react'
import { editProjectApi, deleteProjectImageApi } from '../../apis/projectsApi'
import useApi from '../../hooks/useApi'
import CameraIcon from '../../svg/others/CameraIcon'
import CloseIcon from '../../svg/others/CloseIcon'
import '../../css/components/AddEditTask.css'

export default function EditProject({ currentProject }) {
  const croppedImage = useSelector((state) => state.navigation.croppedProjectImage)

  const dispatch = useDispatch()

  const [values, setValues] = useState({
    name: currentProject.name,
    image: currentProject.photo ? `https://intime-9hga.onrender.com/api/v1/images/${currentProject.photo}` : currentProject.photo
  })
  const [nameError, setNameError] = useState('')
  const [coverHovered, setCoverHovered] = useState(false)
  const [apiCallAttempt, setApiCallAttempt] = useState(0)

  const imageInputRef = useRef()

  const {
		fetchApi : fetchEditProjectApi,
		apiData: editProjectApiData,
		apiError: editProjectApiError,
		apiLoading: editProjectApiLoading
	} = useApi(editProjectApi)

  const {
		fetchApi : fetchDeleteProjectImageApi,
		apiError: deleteProjectImageApiError
	} = useApi(deleteProjectImageApi)

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
    if (editProjectApiData) {
      dispatch(setCurrentProject({
        ...currentProject,
        ...values
      }))

      dispatch(removePopup('edit project'))

      dispatch(setActionDone('edit project'))
    }
    // eslint-disable-next-line
	}, [editProjectApiData, dispatch, values])

  // handle update api errors
	useEffect(() => {
    if (editProjectApiError === 'Project name must be unique.') {
      setNameError('This project name already exists!')
    } else if (editProjectApiError) {
      console.log(editProjectApiError)
    }
	}, [editProjectApiError, apiCallAttempt, dispatch])

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

    const nameChanged = currentProject.name !== values.name
    
    if (values.image === '') {
      await fetchDeleteProjectImageApi(currentProject._id)
    }
    
    await fetchEditProjectApi(values, currentProject._id, nameChanged)

    setApiCallAttempt(prevAttempts => prevAttempts + 1)
  }

  
  if (deleteProjectImageApiError) {
		console.log(deleteProjectImageApiError)
	}
    
  return (
    <form
      className='edit-project-popup'
      onSubmit={handleSubmit}
    >
      <div  className='edit-project-heading'>
        <p>Edit Project</p>

        <CloseIcon
          className='close-edit-project'
          onClick={() => dispatch(removePopup('edit project'))}
        />
      </div>
      
      <div  className='edit-project-content'>
        <div className='edit-project-input-block'>
          <input
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

          <div className='edit-project-input-block edit-project-cover-block-container'>
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
                  src={values.image}
                  alt='cover' 
                  onError={(e) => {
                    e.target.onerror = null
                    setValues({
                      ...values,
                      image: ''
                    })
                  }}
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

        <div className='popup-button-wrapper'>
          <button
            type='submit'
            className='edit-project-button'
            disabled={editProjectApiLoading}
          >
            Edit
          </button>
          
          <button
            type='button'
            className='cancel-edit-project-button'
            onClick={() => dispatch(removePopup('edit'))}
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  )
}