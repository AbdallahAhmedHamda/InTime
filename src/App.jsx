import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setEmail, setName, setPhone, setProfilePic, setTitle, setAbout, setId, setRank, setTotalPoints, setLevel, setCompletedTasks, setInProgressTasks, setPoints, setTags, resetUserState } from './features/user/userSlice'
import { resetNavigationState, setAllRanks, setIsAuthenticated } from './features/navigation/navigationSlice'
import { useEffect, useState } from 'react'
import { isMobile, isTablet } from 'react-device-detect'
import { userDataApi, rankApi } from './apis/userApi'
import { refreshTokenApi } from './apis/authApi'
import { allTasksApi } from './apis/tasksApi'
import useApi from './hooks/useApi'
import { fillDaily, fillMonthly, fillYearly } from './functions/pointsFunctions'
import MobileRedirect from './pages/MobileRedirect'
import ForgotPassword from './pages/ForgotPassword'
import ChangePassword from './pages/ChangePassword'
import ResetPassword from './pages/ResetPassword'
import Notifications from './pages/Notifications'
import SideNav from './components/others/SideNav'
import Popups from './components/others/Popups'
import Navbar from './components/others/Navbar'
import Settings from './pages/Settings'
import Calendar from './pages/Calendar'
import Projects from './pages/Projects'
import NotFound from './pages/NotFound'
import Project from './pages/Project'
import SendOTP from './pages/SendOTP'
import Profile from './pages/Profile'
import Search from './pages/Search'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import Intro from './pages/Intro'
import Board from './pages/Board'
import Tasks from './pages/Tasks'
import Home from './pages/Home'
import Chat from './pages/Chat'

export default function App() {
	const currentEmail = useSelector((state) => state.navigation.currentEmail)
	const isAuthenticated = useSelector((state) => state.navigation.isAuthenticated)
	
	const dispatch = useDispatch()
	
	const [loading, setLoading] = useState(true)

	const {
		fetchApi : fetchUserDataApi,
		apiData: userDataApiData,
		apiError: userDataApiError,
		apiLoading: userDataApiLoading,
	} = useApi(userDataApi)

	const {
		fetchApi : fetchRankApi,
		apiData: rankApiData,
		apiError: rankApiError,
		apiLoading: rankApiLoading,
	} = useApi(rankApi)

	const {
		fetchApi : fetchTagsApi,
		apiData: tagsApiData,
		apiError: tagsApiError,
		apiLoading: tagsApiLoading,
	} = useApi(allTasksApi)
	
	// check if user is authenticated or not
	useEffect(() => {
    const refreshToken = localStorage.getItem('refreshToken')
    const accessToken = localStorage.getItem('accessToken')

    if (refreshToken && accessToken) {
			const checkAuthentication = async () => {				
				try {
					const data = await refreshTokenApi(refreshToken)
	
					dispatch(setIsAuthenticated(true))
						
					localStorage.setItem('refreshToken', data.newRefreshToken)
					localStorage.setItem('accessToken', data.newAccessToken)
				} catch (error) {
					dispatch(setIsAuthenticated(false))

					localStorage.removeItem('refreshToken')
					localStorage.removeItem('accessToken')

					console.error('Error in updating refresh token:', error.message)

					setLoading(false)
				}
			}

			checkAuthentication()
    } else {
      dispatch(setIsAuthenticated(false))
			setLoading(false)
    }
	}, [dispatch])
		
	// load account data when the user is authenticated
	useEffect(() => {
		const fetchApis = async () => {
			if (isAuthenticated) {
				await fetchUserDataApi()

				await fetchRankApi()

				await fetchTagsApi({
					page: 1,
					size: 0,
					sortingType: 1
				})
			} else {
				dispatch(resetNavigationState())
				dispatch(resetUserState())
			}
		}
	
		fetchApis()
	}, [isAuthenticated, fetchUserDataApi, fetchRankApi, fetchTagsApi, dispatch])

	// change the account data when the api loads
	useEffect(() => {
		if (isAuthenticated) {
			if (userDataApiData?.success) {
				const filledDaily = fillDaily(userDataApiData.record.points.daily)
				const filledMonthly = fillMonthly(userDataApiData.record.points.monthly)
				const filledYearly = fillYearly(userDataApiData.record.points.yearly)

				dispatch(setId(userDataApiData.record._id))
				dispatch(setName(userDataApiData.record.name))
				dispatch(setEmail(userDataApiData.record.email))
				dispatch(setPhone('0' + userDataApiData.record.phone))
				dispatch(setProfilePic(`https://intime-9hga.onrender.com/api/v1/images/${userDataApiData.record.avatar}`))
				dispatch(setTitle(userDataApiData.record.title ? userDataApiData.record.title : ''))
				dispatch(setAbout(userDataApiData.record.about ? userDataApiData.record.about.replace(/\r\n/g, '\n') : ''))
				dispatch(setTotalPoints(
					{
						overall: userDataApiData.record.points.totalPoints,
						thisMonth: filledMonthly.points[filledMonthly.points.length - 1],
						lastMonth: filledMonthly.points[filledMonthly.points.length - 2]
					}
				))
				dispatch(setPoints(
					{
						daily: filledDaily,
						monthly: filledMonthly,
						yearly: filledYearly
					}
				))
				dispatch(setLevel(Math.floor(userDataApiData.record.points.totalPoints / 100) + 1))
				dispatch(setCompletedTasks(userDataApiData.record.tasks.completedTasks))
				dispatch(setInProgressTasks(userDataApiData.record.tasks.onGoingTasks))
			}
		}
  }, [userDataApiData, isAuthenticated, dispatch]) 

	// change the ranks data when the api loads
	useEffect(() => {
		if (isAuthenticated) {
			if (rankApiData) {
				dispatch(setRank(rankApiData.myRank + 1))
				dispatch(setAllRanks(rankApiData.rankedUser))
			}
		}
	}, [rankApiData, isAuthenticated, dispatch])
	
	// change the tags data when the api loads
	useEffect(() => {
		if (isAuthenticated) {
			if (tagsApiData) {
				dispatch(setTags(
					tagsApiData.tags
						.filter((item) => item.name.trim() !== '')
						.filter((item, index, self) =>
							index === self.findIndex((t) => (
								t.name.trim().toLowerCase() === item.name.trim().toLowerCase()
							))
						)
				))

				setLoading(false)
			}
		}
	}, [tagsApiData, isAuthenticated, dispatch])

	// disable enter button when a button is focused
	useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && e.target.tagName === 'BUTTON') {
        e.preventDefault()
      }
    }

    document.body.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

	const Layout = ({ children }) => (
		<>
			<Navbar />

			<SideNav />

			{children}
		</>
	)

	const PrivateRoute = ({ children }) => {
		if (isMobile || isTablet) {
			return <Navigate to={'/mobileRedirect'} />
		}
		return isAuthenticated ? children : <Navigate to='/signin' />
	}
	
	const PublicRoute = ({ children }) => {
		if (isMobile || isTablet) {
			return <Navigate to={'/mobileRedirect'} />
		}
		return isAuthenticated ? <Navigate to='/home' /> : children
	}
	
	const EmailCheck = ({ children }) => {
		if (isMobile || isTablet) {
			return <Navigate to={'/mobileRedirect'} />
		}
		return currentEmail ? children : <Navigate to='/signin' />
	}

	if (loading || userDataApiLoading || tagsApiLoading || rankApiLoading) {
		return (
			<div
				style={{ 
					backgroundColor: 'white',
					width: '100vw',
					height: '100vh'
				}}
			/>
		)
	}

	if (userDataApiError) {
		console.log(userDataApiError)

		setLoading(false)
	}

	if (rankApiError) {
		console.log(rankApiError)

		setLoading(false)
	}

	if (tagsApiError) {
		console.log(tagsApiError)

		setLoading(false)
	}

	return (
		<Router>
			<Routes>
				<Route
					path='/'
					element={
						<PublicRoute>
							<Intro />
						</PublicRoute>
					}
				/>

				<Route
					path='/signin'
					element={
						<PublicRoute>
							<Signin/>
						</PublicRoute>
					}
				/>

				<Route
					path='/signup'
					element={
						<PublicRoute>
							<Signup />
						</PublicRoute>
					}
				/>

				<Route
					path='/forgotPassword'
					element={
						<PublicRoute>
							<ForgotPassword />
						</PublicRoute>
					}
				/>

				<Route
					path='/sendOTP'
					element={
						<PublicRoute>
							<EmailCheck>
								<SendOTP/>
							</EmailCheck>
						</PublicRoute>
					}
				/>

				<Route
					path='/resetPassword'
					element={
						<PublicRoute>
							<EmailCheck>
								<ResetPassword />
							</EmailCheck>
						</PublicRoute>
					}
				/>

				<Route
					path='/changePassword'
					element={
						<PrivateRoute>
							<ChangePassword />
						</PrivateRoute>
					}
				/>
				
				<Route
					path='/home'
					element={
						<PrivateRoute>
							<Layout>
								<Home />
							</Layout>
						</PrivateRoute>
					}
				/>

				<Route
					path='/tasks'
					element={
						<PrivateRoute>
							<Layout>
								<Tasks />
							</Layout>
						</PrivateRoute>
					}
				/>

				<Route path='/projects'>
					<Route
						index
						element={
							<PrivateRoute>
								<Layout>
									<Projects />
								</Layout>
							</PrivateRoute>
						}
					/>

					<Route path=':projectId'>
						<Route
							index
							element={
								<PrivateRoute>
									<Layout>
										<Project />
									</Layout>
								</PrivateRoute>
							}
						/>

						<Route
							path='chat'
							element={
								<PrivateRoute>
									<Layout>
										<Chat />
									</Layout>
								</PrivateRoute>
							}
						/>
					</Route>
				</Route>


				<Route path='/calendar'>
					<Route
						index
						element={
							<PrivateRoute>
								<Layout>
									<Calendar />
								</Layout>
							</PrivateRoute>
						}
					/>

					<Route
						path=':stringDate'
						element={
							<PrivateRoute>
								<Layout>
									<Board />
								</Layout>
							</PrivateRoute>
						}
					/>
				</Route>

				<Route
					path='/notifications'
					element={
						<PrivateRoute>
							<Layout>
								<Notifications />
							</Layout>
						</PrivateRoute>
					}
				/>

				<Route
					path='/profile/:id'
					element={
						<PrivateRoute>
							<Layout>
								<Profile />
							</Layout>
						</PrivateRoute>
					}
				/>

				<Route
					path='/settings'
					element={
						<PrivateRoute>
							<Layout>
								<Settings />
							</Layout>
						</PrivateRoute>
					}
				/>

				<Route
					path='/search/:searchValue'
					element={
						<PrivateRoute>
							<Layout>
								<Search />
							</Layout>
						</PrivateRoute>
					}
				/>

				<Route
					path='/mobileRedirect'
					element={<MobileRedirect />}
				/>
				
				<Route
					path='*'
					element={<NotFound />}
				/>
			</Routes>

			<Popups />
		</Router>
	)
}