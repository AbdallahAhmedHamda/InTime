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
	currentEmail: '',
	currentPassword: '',
	currentPage: trimPath(window.location.pathname),
	isAuthenticated: false,
	popups: [],
	currentTask: '',
	uncroppedImage: '',
	croppedImage: '',
	filters: {
		creator: [],
		status: [],
		priority: [],
		tags: []
	},
	sorting: {
		type: '',
		order: ''
	},
}

const navigationSlice = createSlice({
	name: 'currentObject',
	initialState,
	reducers: {
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
		setUncroppedImage: (state, action) => {
			state.uncroppedImage = action.payload
		},
		setCroppedImage: (state, action) => {
			state.croppedImage = action.payload
		},
		setFilters: (state, action) => {
			state.filters = action.payload
		},
		setSorting: (state, action) => {
			state.sorting = action.payload
		}
	}
})

export const {
	setCurrentEmail,
	setCurrentPassword,
	setCurrentPage,
	setIsAuthenticated,
	addPopup,
	removePopup,
	removeAllPopups,
	setCurrentTask,
	setUncroppedImage,
	setCroppedImage,
	setFilters,
	setSorting
} = navigationSlice.actions
export default navigationSlice.reducer