import axios from 'axios'

const API_URL = 'https://intime-9hga.onrender.com/api/v1/user/projects'

const convertImage = async (imageSource) => {
  try {
    let blob

    if (imageSource.startsWith('data:')) {
      // Base64 string
      const byteString = atob(imageSource.split(',')[1])
      const mimeString = imageSource.split(',')[0].split(':')[1].split(';')[0]

      const ab = new ArrayBuffer(byteString.length)
      const ia = new Uint8Array(ab)

      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }

      blob = new Blob([ab], { type: mimeString })
    } else {
      // HTTP URL
      const response = await fetch(imageSource)
      const blobData = await response.blob()
      
      blob = new Blob([blobData], { type: blobData.type })
    }

    // Create FormData and append the Blob with key 'image'
    const formData = new FormData()
    formData.append('image', blob, 'uploaded_image.png')

    return formData
  } catch (error) {
    console.error('Error converting image:', error)

    return null
  }
}

export const createProjectApi = async (values) => {
  try {
    const accessToken = localStorage.getItem('accessToken')

    const formData = new FormData()
    
    formData.append('name', values.name)

    if (values.image) {
      const image = await convertImage(values.image)
      formData.append('image', image.get('image'))
    }
    
    const response = await axios.post(`${API_URL}/createProject`,
      formData, 
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    )

    if (response.data.success) {
      return response.data
    } else {
      throw new Error(response.data.message || 'Unknown error occurred')
    }
  } catch (error) {
    if (error.response) {
      error.message = error.response.data.message || 'Unknown error occurred'
    }
    
    throw error
  }
}