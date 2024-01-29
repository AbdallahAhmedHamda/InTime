import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Navbar from './Components/Navbar'
import SideNav from './Components/SideNav'
import Home from './Pages/Home'
import Tasks from './Pages/Tasks'
import Calendar from './Pages/Calendar'
import Notifications from './Pages/Notifications'
import Settings from './Pages/Settings'
import AddTask from './Components/AddTask'

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