import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Popups from './components/Popups'
import Notifications from './pages/Notifications'
import SideNav from './components/SideNav'
import Navbar from './components/Navbar'
import Settings from './pages/Settings'
import Calendar from './pages/Calendar'
import Tasks from './pages/Tasks'
import Home from './pages/Home'

export default function App() {
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
	
	return (
		<Router>
			<Navbar />

			<SideNav />
		
			<Routes>
				<Route path='/' element={<Home />}/>

				<Route path='/tasks' element={<Tasks />}/>

				<Route path='/calendar' element={<Calendar />}/>
	
				<Route path='/notifications' element={<Notifications />}/>

				<Route path='/settings' element={<Settings />}/>
			</Routes>

			<Popups />
		</Router>
	)
}