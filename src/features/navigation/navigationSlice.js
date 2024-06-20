import { createSlice } from'@reduxjs/toolkit'

// trimming the path so i can get which page am i at without any other nested routes or params
const trimPath = (pathname) => {
	const firstSlashIndex = pathname.indexOf('/')
	const secondSlashIndex = pathname.indexOf('/', firstSlashIndex + 1)
	const trimmedString =
		(secondSlashIndex !== -1)
			? pathname.substring(firstSlashIndex + 1, secondSlashIndex)
			: pathname.substring(firstSlashIndex + 1)
			
	return(trimmedString)
}

const initialState = {
	allRanks: {},
	currentEmail: '',
	currentPassword: '',
	currentPage: trimPath(window.location.pathname),
	isAuthenticated: false,
	renderCount: 1,
	popups: [],
	currentTask: '',
	uncroppedTaskImage: '',
	croppedTaskImage: '',
	uncroppedProfilePic: '',
	croppedProfilePic: '',
}

const navigationSlice = createSlice({
	name: 'currentObject',
	initialState,
	reducers: {
		setAllRanks: (state, action) => {
			state.allRanks = action.payload
		},
		setCurrentEmail: (state, action) => {
			state.currentEmail = action.payload
		},
		setCurrentPassword: (state, action) => {
			state.currentPassword = action.payload
		},
		setCurrentPage: (state, action) => {
			state.currentPage = action.payload
		},
		setIsAuthenticated: (state, action) => {
			state.isAuthenticated = action.payload
		},
		incrementRenderCount: (state) => {
			state.renderCount += 1
		},
		resetRenderCount: (state) => {
			state.renderCount = 1
		},
		addPopup: (state, action) => {
			if (state.popups[state.popups.length - 1] !== action.payload) {
				state.popups.push(action.payload)
			}
		},
		removePopup: (state, action) => {
			state.popups = state.popups.filter(popup => popup !== action.payload)
		},
		removeAllPopups: (state) => {
			if (state.popups.length !== 0) {
				state.popups = []
			}
		},
		setCurrentTask: (state, action) => {
			state.currentTask = action.payload
		},
		setUncroppedTaskImage: (state, action) => {
			state.uncroppedTaskImage = action.payload
		},
		setCroppedTaskImage: (state, action) => {
			state.croppedTaskImage = action.payload
		},
		setUncroppedProfilePic: (state, action) => {
			state.uncroppedProfilePic = action.payload
		},
		setCroppedProfilePic: (state, action) => {
			state.croppedProfilePic = action.payload
		}
	}
})

export const {
	setAllRanks, 
	setCurrentEmail, 
	setCurrentPassword,
	setCurrentPage,
	setIsAuthenticated,
	incrementRenderCount,
	resetRenderCount,
	addPopup,
	removePopup,
	removeAllPopups,
	setCurrentTask,
	setUncroppedTaskImage,
	setCroppedTaskImage,
	setUncroppedProfilePic,
	setCroppedProfilePic,
} = navigationSlice.actions
export default navigationSlice.reducer