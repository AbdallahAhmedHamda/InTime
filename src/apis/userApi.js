import axios from 'axios'

const API_URL = 'https://intime-9hga.onrender.com/api/v1/user'

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

    // Create FormData and append the Blob with key 'avatar'
    const formData = new FormData()
    formData.append('avatar', blob, 'uploaded_image.png')

    return formData
  } catch (error) {
    console.error('Error converting image:', error)

    return null
  }
}

export const userDataApi = async () => {
  try {
    const accessToken = localStorage.getItem('accessToken')
    
    const response = await axios.get(API_URL, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })

    if (response.data &&response.data?.success) {
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

export const updateUserApi = async (values) => {
  try {
    const accessToken = localStorage.getItem('accessToken')

    const formData = new FormData()
    
    formData.append('name', values.name)
    formData.append('phone', values.phone)
    formData.append('title', values.title)
    formData.append('about', values.about)

    if (values.profilePic) {
      const profilePic = await convertImage(values.profilePic)
      formData.append('avatar', profilePic.get('avatar'))
    }
    
    const response = await axios.post(`${API_URL}/editProfile`,
      formData, 
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    )

    return response.data
  } catch (error) {
    if (error.response) {
      error.message = error.response.data.message || 'Unknown error occurred'
    }
    
    throw error
  }
}

export const rankApi = async () => {
  try {
    const accessToken = localStorage.getItem('accessToken')
    
    const response = await axios.get(`${API_URL}/getUsersRank`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })

    return response.data
  } catch (error) {
    if (error.response) {
      error.message = error.response.data.message || 'Unknown error occurred'
    }
    
    throw error
  }
}

export const changePasswordApi = async (values) => {
  try {
    const accessToken = localStorage.getItem('accessToken')
    
    const response = await axios.post(`${API_URL}/changePassword`,
      {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmNewPassword
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    )
    
    return response.data
  } catch (error) {
    if (error.response) {
      error.message = error.response.data.message || 'Unknown error occurred'
    }
    
    throw error
  }
}

export const deleteAccountApi = async () => {
  try {
    const accessToken = localStorage.getItem('accessToken')
    
    const response = await axios.delete(`${API_URL}/deleteUser`, 
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    )
    
    return response.data
  } catch (error) {
    if (error.response) {
      error.message = error.response.data.message || 'Unknown error occurred'
    }
    
    throw error
  }
}

export const deleteProfilePicApi = async () => {
  try {
    const accessToken = localStorage.getItem('accessToken')
    
    const response = await axios.post(`${API_URL}/deleteProfilePhoto`, 
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    )
    
    return response.data
  } catch (error) {
    if (error.response) {
      error.message = error.response.data.message || 'Unknown error occurred'
    }
    
    throw error
  }
}

export const pushNotificationApi = async (subscription) => {
  try {
    const accessToken = localStorage.getItem('accessToken')
    
    const response = await axios.post(`${API_URL}/subscribe`,
      subscription,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    )
    
    return response.data
  } catch (error) {
    if (error.response) {
      error.message = error.response.data.message || 'Unknown error occurred'
    }
    
    throw error
  }
}