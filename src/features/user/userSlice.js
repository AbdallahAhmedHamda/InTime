import { createSlice } from'@reduxjs/toolkit'

const initialState = {
  id: '',
  name: '',
  email: '',
  phone: '',
  title: '',
  about: '',
  rank: '',
  profilePic: '',
  points: {},
  totalPoints: {},
  level: '',
  tasks: [],
  completedTasks: '',
  inProgressTasks: '',
  tags: [],
  notifications: []
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setId: (state, action) => {
      state.id = action.payload
    },
    setName: (state, action) => {
      state.name = action.payload
    },
    setEmail: (state, action) => {
      state.email = action.payload
    },
    setPhone: (state, action) => {
      state.phone = action.payload
    },
    setTitle: (state, action) => {
      state.title = action.payload
    },
    setAbout: (state, action) => {
      state.about = action.payload
    },
    setRank: (state, action) => {
      state.rank = action.payload
    },
    setProfilePic: (state, action) => {
      state.profilePic = action.payload
    },
    setPoints: (state, action) => {
      state.points = action.payload
    },
    setTotalPoints: (state, action) => {
      state.totalPoints = action.payload
    },
    setLevel: (state, action) => {
      state.level = action.payload
    },
    setCompletedTasks: (state, action) => {
      state.completedTasks = action.payload
    },
    setInProgressTasks: (state, action) => {
      state.inProgressTasks = action.payload
    },
    setTags: (state, action) => {
      state.tags = action.payload
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload

    },
    resetUserState: (_) => initialState
  }
})

export const { 
  setId,
  setName,
  setEmail,
  setPhone,
  setTitle,
  setAbout,
  setRank,
  setProfilePic,
  setPoints,
  setTotalPoints,
  setLevel,
  setCompletedTasks,
  setInProgressTasks,
  setTags,
  setNotifications,
  resetUserState
} = userSlice.actions

export default userSlice.reducer