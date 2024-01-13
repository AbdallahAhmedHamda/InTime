import { createSlice } from'@reduxjs/toolkit'

// trimming the path so i can get which page am i at without any other nested routes or params
const trimPath = (pathname) => {
	const firstSlashIndex = pathname.indexOf('/')
	if (firstSlashIndex !== -1) {
		const secondSlashIndex = pathname.indexOf('/', firstSlashIndex + 1)
		const trimmedString = (secondSlashIndex !== -1) ? pathname.substring(firstSlashIndex + 1, secondSlashIndex) : pathname.substring(firstSlashIndex + 1)
		return(trimmedString)
	} else {
		console.log('String format not as expected')
	}
}

const initialState = {
currentPage: trimPath(window.location.pathname)
}

const navigationSlice = createSlice({
	name: 'currentPage',
	initialState,
	reducers: {
		setCurrentPage: (state, action) => {
			state.currentPage = action.payload
		}
	}
})

export const { setCurrentPage } = navigationSlice.actions
export default navigationSlice.reducer