import axios from 'axios'

const API_URL = 'https://intime-9hga.onrender.com/api/v1/user'

export const userDataApi = async () => {
  try {
    const accessToken = localStorage.getItem('accessToken')
    
    const response = await axios.get(API_URL, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })

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