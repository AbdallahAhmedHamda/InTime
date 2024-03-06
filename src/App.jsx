import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Transitions from './components/Transitions'
import Notifications from './pages/Notifications'
import SideNav from './components/SideNav'
import Navbar from './components/Navbar'
import Settings from './pages/Settings'
import Calendar from './pages/Calendar'
import Tasks from './pages/Tasks'
import Home from './pages/Home'

export default function App() {
	return (
		<Router>
			<Navbar />

			<SideNav />
		
			<div className='main-content'>
				<Routes>
					<Route path="/" element={<Home />}/>

					<Route path="/tasks" element={<Tasks />}/>

					<Route path="/calendar" element={<Calendar />}/>
		
					<Route path="/notifications" element={<Notifications />}/>

					<Route path="/settings" element={<Settings />}/>
				</Routes>
			</div>

			<Transitions />
		</Router>
	)
}