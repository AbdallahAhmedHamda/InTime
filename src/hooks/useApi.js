import { useDispatch } from 'react-redux'
import { setIsAuthenticated } from '../features/navigation/navigationSlice'
import { useCallback, useState } from 'react'
import { refreshTokenApi } from '../apis/authApi'

export default function useApi(apiFunction) {
  const dispatch = useDispatch()

  const [apiLoading, setApiLoading] = useState(false)
  const [apiError, setApiError] = useState()
  const [apiData, setApiData] = useState()

  const fetchApi = useCallback(async () => {
    setApiLoading(true)

    try {
      const firstApiData = await apiFunction()

      setApiData(firstApiData)
    } catch (firstApiError) {
      if (firstApiError.message === 'Unauthorized') {
        const refreshToken = localStorage.getItem('refreshToken')

        if (refreshToken) {
          try {
            const refreshData = await refreshTokenApi(refreshToken)
                    
            localStorage.setItem('refreshToken', refreshData.newRefreshToken)
            localStorage.setItem('accessToken', refreshData.newAccessToken)

            try {
              const secondApiData = await apiFunction()
      
              setApiData(secondApiData)
            } catch (secondApiError) {
              setApiError('Second api error:', secondApiError.message)
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
        setApiError('Firt api error:', firstApiError.message)
      }
    } finally {
      setApiLoading(false)
    }
  }, [dispatch, apiFunction])

  return { fetchApi, apiLoading, apiError, apiData }
}