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
currentPopup: ''
}

const navigationSlice = createSlice({
	name: 'currentObject',
	initialState,
	reducers: {
		setCurrentPage: (state, action) => {
			state.currentPage = action.payload
		},
		setCurrentPopup: (state, action) => {
			state.currentPopup = action.payload
		}
	}
})

export const {
	setCurrentPage,
	setCurrentPopup
} = navigationSlice.actions
export default navigationSlice.reducer