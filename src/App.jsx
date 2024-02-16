import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useTransition, animated } from 'react-spring'
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

	  // animate popup appearance
		const popupTransition = useTransition(currentPopup, {
			from: { opacity: 0, top: '40%' },
			enter: { opacity: 1, top: '50%' },
			leave: { opacity: 0, top: '40%' },
			config: { duration: 300 }
		})

		// animate dimming
		const dimTransition = useTransition(currentPopup, {
			from: { backgroundColor: 'rgba(0, 0, 0, 0)' },
			enter: { backgroundColor: 'rgba(0, 0, 0, 0.3)' },
			leave: { backgroundColor: 'rgba(0, 0, 0, 0)' },
			config: { duration: 300 }
		})

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

			{dimTransition((style, item) => item && (
				<animated.div className='dim-background no-select' style={style}/>
			))}

			{popupTransition((style, item) => item && (
				<animated.div className='popup' style={style}>
					{item === 'add' ? <	AddTask /> : ''}
				</animated.div>
			))}
		</Router>

	)
}