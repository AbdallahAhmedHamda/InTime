import { createSlice } from'@reduxjs/toolkit'

const initialState = {
  name: 'Jessica Lambert',
  profilePic: require('../../Images/profile-pic.jpeg'),
  level: 3,
  unreadNotifications: 2
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setName: (state, action) => {
      state.name = action.payload
    },
    setProfilePic: (state, action) => {
      state.profilePic = action.payload
    },
    setLevel: (state, action) => {
      state.level = action.payload
    },
    removeUnread: (state) => {
      state.unreadNotifications = 0
    }
  }
})

export const { setName, setProfilePic, setLevel, removeUnread } = userSlice.actions
export default userSlice.reducer