import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
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
	
	return (
		<Router>
			<Routes>
				<Route
					path='/'
					element={<Intro />}
				/>

				<Route
					path='/signin'
					element={<Signin />}
				/>

				<Route
					path='/signup'
					element={<Signup />}
				/>

				<Route
					path='/forgotPassword'
					element={<ForgotPassword />}
				/>

				<Route
					path='/sendOTP'
					element={<SendOTP />}
				/>

				<Route
					path='/resetPassword'
					element={<ResetPassword />}
				/>

				<Route
					path='/changePassword'
					element={<ChangePassword />}
				/>
				
				<Route
					path='/home'
					element={<Layout><Home /></Layout>}
				/>

				<Route
					path='/tasks'
					element={<Layout><Tasks /></Layout>}
				/>

				<Route path='/calendar'>
					<Route
						index
						element={<Layout><Calendar /></Layout>}
					/>

					<Route
						path=':stringDate'
						element={<Layout><Board /></Layout>}
					/>
				</Route>

				<Route
					path='/notifications'
					element={<Layout><Notifications /></Layout>}
				/>

				<Route
					path='/settings'
					element={<Layout><Settings /></Layout>}
				/>

				<Route
					path='/search/:searchValue'
					element={<Layout><Search /></Layout>}
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