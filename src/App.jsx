import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './Components/Navbar'
import SideNav from './Components/SideNav'
import Home from './Pages/Home'
import Tasks from './Pages/Tasks'
import Calendar from './Pages/Calendar'
import Notifications from './Pages/Notifications'
import Settings from './Pages/Settings'

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
		</Router>
	)
}