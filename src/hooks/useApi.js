import { useDispatch } from 'react-redux'
import { setIsAuthenticated } from '../features/navigation/navigationSlice'
import { useCallback, useState } from 'react'
import { refreshTokenApi } from '../apis/authApi'

export default function useApi(apiFunction) {
  const dispatch = useDispatch()

  const [apiLoading, setApiLoading] = useState(false)
  const [apiError, setApiError] = useState(null)
  const [apiData, setApiData] = useState(null)

  const fetchApi = useCallback(async (...args) => {
    setApiLoading(true)

    try {
      const firstApiData = await apiFunction(...args)

      setApiData(firstApiData)
      setApiError(null)
    } catch (firstApiError) {
      if (firstApiError.message === 'Unauthorized') {
        const refreshToken = localStorage.getItem('refreshToken')

        if (refreshToken) {
          try {
            const refreshData = await refreshTokenApi(refreshToken)
                    
            localStorage.setItem('refreshToken', refreshData.newRefreshToken)
            localStorage.setItem('accessToken', refreshData.newAccessToken)

            try {
              const secondApiData = await apiFunction(...args)
      
              setApiData(secondApiData)
              setApiError(null)
            } catch (secondApiError) {
              setApiError(secondApiError.message)
              setApiData(null)
            }
          } catch (refreshError) {
            dispatch(setIsAuthenticated(false))
  
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('accessToken')
          }
        } else {
          dispatch(setIsAuthenticated(false))
        }
      } else {
        setApiError(firstApiError.message)
        setApiData(null)
      }
    } finally {
      setApiLoading(false)
    }
  }, [dispatch, apiFunction])

  return { fetchApi, apiLoading, apiError, apiData }
}