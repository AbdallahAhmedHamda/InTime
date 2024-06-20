import axios from 'axios'

const API_URL = 'https://intime-9hga.onrender.com/api/v1/user/tasks'

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

const processCreateTask = async (task, formData) => {
  for (const key of Object.keys(task)) {
    const value = task[key]

    if ((typeof value === 'string' && value.trim() !== '') ||
        (typeof value === 'number') || 
        (typeof value === 'boolean')) {
      
      if (key === 'image') {
        const image = await convertImage(value)

        formData.append('image', image.get('image'))
      } else {
        formData.append(key, value.toString())
      }
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.keys(value).forEach(subKey => {
        formData.append(`${key}[${subKey}]`, value[subKey])
      })
    } else if ((Array.isArray(value) && value.length > 0)) {
      value.forEach((element, index) => {
        formData.append(`${key}[${index}][stepDisc]`, element.toString())
      })
    }
  }
}

const processEditTask = async (task, formData, nameChanged) => {
  for (const key of Object.keys(task)) {
    const value = task[key]

    if ((typeof value === 'string') ||
        (typeof value === 'number') || 
        (typeof value === 'boolean')) {
      
      if (key === 'image' && value !== '') {
        const image = await convertImage(value)

        formData.append('image', image.get('image'))
      } else if (key !== 'image') {
        if ((key === 'name' && nameChanged) || (key !== 'name')) {
          formData.append(key, value.toString())
        }
      }
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.keys(value).forEach(subKey => {
        formData.append(`${key}[${subKey}]`, value[subKey])
      })
    } else if (Array.isArray(value)) {
      value.forEach((element, index) => {
        if (typeof element?.completed === 'boolean') {
          formData.append(`${key}[${index}][stepDisc]`, element.stepDisc.toString())
          formData.append(`${key}[${index}][_id]`, element._id.toString())
          formData.append(`${key}[${index}][completed]`, element.completed.toString())
        } else {
          formData.append(`${key}[${index}][stepDisc]`, element.stepDisc.toString())
        }
      })
    }
  }
}

export const allTasksApi = async (paramsObject) => {
  try {
    const accessToken = localStorage.getItem('accessToken')

    const params = {}

    if (paramsObject) {
      Object.keys(paramsObject).forEach(key => {
        const value = paramsObject[key]

        if ((typeof value === 'string' && value.trim() !== '') || 
        (Array.isArray(value) && value.length > 0) || 
        (typeof value === 'number') || 
        (typeof value === 'boolean') || 
        (typeof value === 'object' && !Array.isArray(value))) {
          if (key === 'tag') {
            params['tag.name'] = value.map((tag) => tag.name)
          } else {
            params[key] = value
          }
        }
      })
    }

    const response = await axios.get(`${API_URL}/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      params
    })

    if (response.data && response.data?.success) {
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

export const searchTasksApi = async (searchQuery) => {
  try {
    const accessToken = localStorage.getItem('accessToken')

    const response = await axios.get(`${API_URL}/searchTasks/${searchQuery}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      }
    })

    if (response.data && response.data?.success) {
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

export const createTaskApi = async (task) => {
  try {
    const accessToken = localStorage.getItem('accessToken')

    const formData = new FormData()

    await processCreateTask(task, formData)

    const response = await axios.post(`${API_URL}/addUserTask`, formData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      }
    })

    if (response.data && response.data?.success) {
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

export const updateTaskApi = async (task, id, nameChanged) => {
  try {
    const accessToken = localStorage.getItem('accessToken')

    const formData = new FormData()

    await processEditTask(task, formData, nameChanged)

    const response = await axios.post(`${API_URL}/updateById/${id}`, formData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      }
    })

    if (response.data && response.data?.success) {
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

export const toggleStepApi = async (steps, id) => {
  try {
    const accessToken = localStorage.getItem('accessToken')

    const formData = new FormData()

    steps.forEach((element, index) => {
      formData.append(`steps[${index}][stepDisc]`, element.stepDisc.toString())
      formData.append(`steps[${index}][_id]`, element._id.toString())
      formData.append(`steps[${index}][completed]`, element.completed.toString())
    })

    const response = await axios.post(`${API_URL}/updateById/${id}`, formData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      }
    })

    if (response.data && response.data?.success) {
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

export const completeTaskApi = async (id) => {
  try {
    const accessToken = localStorage.getItem('accessToken')

    const response = await axios.post(`${API_URL}/completeTask/${id}`, null, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      }
    })

    if (response.data && response.data?.success) {
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

export const deleteTaskApi = async (id) => {
  try {
    const accessToken = localStorage.getItem('accessToken')

    const response = await axios.post(`${API_URL}/deleteById/${id}`, null, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      }
    })

    if (response.data && response.data?.success) {
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

export const deleteTaskImageApi = async (id) => {
  try {
    const accessToken = localStorage.getItem('accessToken')
    
    const response = await axios.delete(`${API_URL}/removeTaskImage/${id}`, 
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