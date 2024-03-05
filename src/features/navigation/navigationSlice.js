import { createSlice } from'@reduxjs/toolkit'

// trimming the path so i can get which page am i at without any other nested routes or params
const trimPath = (pathname) => {
	const firstSlashIndex = pathname.indexOf('/')
	const secondSlashIndex = pathname.indexOf('/', firstSlashIndex + 1)
	const trimmedString = (secondSlashIndex !== -1) ? pathname.substring(firstSlashIndex + 1, secondSlashIndex) : pathname.substring(firstSlashIndex + 1)
	return(trimmedString)
}

const initialState = {
	currentPage: trimPath(window.location.pathname),
	popups: [],
	uncroppedImage: '',
	croppedImage: '',
	verifyData: ''
}

const navigationSlice = createSlice({
	name: 'currentObject',
	initialState,
	reducers: {
		setCurrentPage: (state, action) => {
			state.currentPage = action.payload
		},
		addPopup: (state, action) => {
			state.popups.push(action.payload)
		},
		removePopup: (state, action) => {
			state.popups = state.popups.filter(popup => popup !== action.payload)
		},
		removeAllPopups: (state) => {
			state.popups = []
		},
		setUncroppedImage: (state, action) => {
			state.uncroppedImage = action.payload
		},
		setCroppedImage: (state, action) => {
			state.croppedImage = action.payload
		},
		setVerifyData: (state, action) => {
			state.verifyData = action.payload
		}
	}
})

export const {
	setCurrentPage,
	addPopup,
	removePopup,
	removeAllPopups,
	setUncroppedImage,
	setCroppedImage,
	setVerifyData
} = navigationSlice.actions
export default navigationSlice.reducer