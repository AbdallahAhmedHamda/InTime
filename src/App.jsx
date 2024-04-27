import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Notifications from './pages/Notifications'
import SideNav from './components/others/SideNav'
import Popups from './components/others/Popups'
import Navbar from './components/others/Navbar'
import Settings from './pages/Settings'
import Calendar from './pages/Calendar'
import NotFound from './pages/NotFound'
import Search from './pages/Search'
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
				<Route path='/' element={<Layout><Home /></Layout>} />

				<Route path='/tasks' element={<Layout><Tasks /></Layout>} />

				<Route path='/calendar'>
					<Route index element={<Layout><Calendar /></Layout>} />

					<Route path=':stringDate' element={<Layout><Board /></Layout>} />
				</Route>

				<Route path='/notifications' element={<Layout><Notifications /></Layout>} />

				<Route path='/settings' element={<Layout><Settings /></Layout>} />

				<Route path='/search/:searchValue' element={<Layout><Search /></Layout>} />
				
				<Route path='*' element={<NotFound />} />
			</Routes>

			<Popups />
		</Router>
	)
}