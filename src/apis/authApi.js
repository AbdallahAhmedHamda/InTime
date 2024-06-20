import axios from 'axios'

const API_URL = 'https://intime-9hga.onrender.com/api/v1/auth'

const handleAxiosError = (error) => {
  if (error.response) {
    error.message = error.response.data.message || 'Unknown error occurred'
  }

  throw error
}

export const loginApi = async (values) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email: values.email,
      password: values.password
    })

    return response.data
  } catch (error) {
    handleAxiosError(error)
  }
}

export const singupApi = async (values) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, {
      name : values.name,
      password : values.password,
      email : values.email,
      phone :values.phone
    })

    return response.data
  } catch (error) {
    handleAxiosError(error)
  }
}

export const activationApi = async (otp, email) => {
  try {
    const response = await axios.post(`${API_URL}/activation/${otp}`, { email })

    return response.data
  } catch (error) {
    handleAxiosError(error)
  }
}

export const resendActivationApi = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/resendactivationcode`, { email })

    if (response.data && response.data?.success) {
      return response.data
    } else {
      throw new Error(response.data.message || 'Unknown error occurred')
    }
  } catch (error) {
    handleAxiosError(error)
  }
}

export const forgotPasswordApi = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/forgetpassword`, { email })

    return response.data
  } catch (error) {
    handleAxiosError(error)
  }
}

export const resetPasswordApi = async (otp, values, currentEmail) => {
  try {
    const response = await axios.post(`${API_URL}/forgetpassword/changepassword/${otp}`, {
      password: values.password,
      confirmPassword: values.confirmPassword,
      email: currentEmail
    })

    return response.data
  } catch (error) {
    handleAxiosError(error)
  }
}

export const refreshTokenApi = async (refreshToken) => {
  try {
    const response = await axios.post(`${API_URL}/refreshToken`, { refreshToken })

    if (response.data && response.data?.success) {
      return response.data
    } else {
      throw new Error(response.data.message || 'Unknown error occurred')
    }
  } catch (error) {
    handleAxiosError(error)
  }
}

export const signOutApi = async (refreshToken) => {
  try {
    const response = await axios.post(`${API_URL}/signOut`, { refreshToken })

    return response.data
  } catch (error) {
    handleAxiosError(error)
  }
}