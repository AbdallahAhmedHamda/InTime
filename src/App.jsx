import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Navbar from './components/Navbar'
import SideNav from './components/SideNav'
import Home from './pages/Home'
import Tasks from './pages/Tasks'
import Calendar from './pages/Calendar'
import Notifications from './pages/Notifications'
import Settings from './pages/Settings'
import AddTask from './components/AddTask'

export default function App() {
	const currentPopup = useSelector((state) => state.navigation.currentPopup)

	const popupBackgroundStyles = {
		backgroundColor: 'rgba(0, 0, 0, 0.3)',
		position: 'fixed',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		zIndex: 500,
		userSelect: 'none',
		PointerEvents: 'none'
	}

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

			{currentPopup && <div style={popupBackgroundStyles} />}

			{currentPopup === 'add' ?							
				<AddTask /> : ''
			}
		</Router>
	)
}