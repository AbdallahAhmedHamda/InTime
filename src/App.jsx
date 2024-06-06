import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import ChangePassword from './pages/ChangePassword'
import Notifications from './pages/Notifications'
import SideNav from './components/others/SideNav'
import Popups from './components/others/Popups'
import Navbar from './components/others/Navbar'
import Settings from './pages/Settings'
import Calendar from './pages/Calendar'
import NotFound from './pages/NotFound'
import SendOTP from './pages/SendOTP'
import Search from './pages/Search'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import Intro from './pages/Intro'
import Board from './pages/Board'
import Tasks from './pages/Tasks'
import Home from './pages/Home'

export default function App() {
	const currentEmail = useSelector((state) => state.navigation.currentEmail)

	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [loading, setLoading] = useState(true)

	// check if user is authenticated or not
	useEffect(() => {
    const refreshToken = localStorage.getItem('refreshToken')
    const accessToken = localStorage.getItem('accessToken')

    if (refreshToken && accessToken) {
			fetch('https://intime-9hga.onrender.com/api/v1/auth/refreshToken', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					refreshToken: refreshToken,
				}),
			})
				.then((response) => response.json())
				.then((data) => {  
					if (data.success) {    
						setIsAuthenticated(true)
						
						localStorage.setItem('refreshToken', data.newRefreshToken)
						localStorage.setItem('accessToken', data.newAccessToken)
					} else {
						setIsAuthenticated(false)

						localStorage.removeItem('refreshToken')
						localStorage.removeItem('accessToken')
					}
				})
				.catch((error) => {          
					console.error('Error in sending otp:', error)
				})
				.finally(() => {
					setLoading(false)
				})
    } else {
      setIsAuthenticated(false)
			setLoading(false)
    }
  }, [])

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
			<Navbar onSignout={() => setIsAuthenticated(false)} />

			<SideNav />

			{children}
		</>
	)

  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/" />
  }

  const PublicRoute = ({ children }) => {
    return isAuthenticated ? <Navigate to="/home" /> : children
  }

	const EmailCheck = ({ children }) => {
    return currentEmail ? children : <Navigate to="/" />
  }

	if (loading) {
		return (
			<div
				style={{ 
					backgroundColor: 'white',
					width: '100vw',
					height: '100vh'
				}}
			>
			
			</div>
		)
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
							<Signin onLogin={() => setIsAuthenticated(true)} />
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
								<SendOTP onLogin={() => setIsAuthenticated(true)} />
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
					path='*'
					element={<NotFound />}
				/>
			</Routes>

			<Popups />
		</Router>
	)
}