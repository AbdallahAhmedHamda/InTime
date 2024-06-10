import { Navigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setIsAuthenticated } from '../features/navigation/navigationSlice'
import { useCallback, useState } from 'react'

export default function useApi() {

  const dispatch = useDispatch()

  const [apiLoading, setApiLoading] = useState(true)
  const [apiError, setApiError] = useState()
  const [apiData, setApiData] = useState({})

  const fetchApi = useCallback((url, options = {}) => {
    const existingRefreshToken = localStorage.getItem('refreshToken')
    const existingAccessToken = localStorage.getItem('accessToken')
    
    // first api call
    fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${existingAccessToken}`,
      },
    })
      .then((firstApiResponse) => firstApiResponse.json())
      .then((firstApiData) => {
        if (firstApiData.success) {    
          setApiData(firstApiData)
        } else {
          // check if refresh token is valid when the access token is expired
          fetch('https://intime-9hga.onrender.com/api/v1/auth/refreshToken', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              refreshToken: existingRefreshToken,
            }),
          })
            .then((refreshTokenResponse) => refreshTokenResponse.json())
            .then((refreshTokenData) => {  
              if (refreshTokenData.success) {
                localStorage.setItem('refreshToken', refreshTokenData.newRefreshToken)
                localStorage.setItem('accessToken', refreshTokenData.newAccessToken)
  
                const newAccessToken = localStorage.getItem('accessToken')
  
                // second api call
                fetch(url, {
                  ...options,
                  headers: {
                    ...options.headers,
                    'Authorization': `Bearer ${newAccessToken}`,
                  },
                })
                  .then((secondApiResponse) => secondApiResponse.json())
                  .then((secondApiData) => {    
                    setApiData(secondApiData)
                  })
                  .catch((error) => {          
                    setApiError('Error in fetching data in the second time: ' + error)
                  })
              } else {
                dispatch(setIsAuthenticated(false))
  
                localStorage.removeItem('refreshToken')
                localStorage.removeItem('accessToken')
        
                return <Navigate to="/signin" />
              }
            })
            .catch((error) => {          
              setApiError('Error in updating refresh token: ' + error)
            })
        }
      })
      .catch((error) => {          
        setApiError('Error in fetching data in the first time: ' + error)
      })
      .finally(() => {
        setApiLoading(false)
      })
  }, [dispatch])

  return { fetchApi, apiLoading, apiError, apiData }
}