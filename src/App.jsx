import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import SideNav from './components/SideNav'
import Home from './pages/Home'
import Tasks from './pages/Tasks'
import Calendar from './pages/Calendar'
import Notifications from './pages/Notifications'
import Settings from './pages/Settings'
import Transitions from './components/Transitions';

export default function App() {

	return (
		<Router>
			<Navbar />

			<SideNav />
		
			<div className='main-content' style={{position: 'relative'}}>
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