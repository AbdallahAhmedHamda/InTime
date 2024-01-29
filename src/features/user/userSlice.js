import { createSlice } from'@reduxjs/toolkit'

const todayDate = new Date()
const months = Array.from({ length: 12 }, (_, i) => {
  return new Date(
    todayDate.getFullYear(),
    i + todayDate.getMonth() + 1,
    todayDate.getDate()
  ).toLocaleString('en-US', { month: 'short' })
})
const days = Array.from({ length: 7 }, (_, i) => {
  return new Date(
    todayDate.getFullYear(),
    todayDate.getMonth(),
    i + todayDate.getDate() + 1
  ).toLocaleString('en-US', { weekday: 'short' })
})

const intialOverallPoints = 5020

const initialState = {
  name: 'Jessica Lambert',
  profilePic: require('../../assets/images/profile-pic.jpeg'),
  unreadNotifications: 2,
  points: {
    monthly: {
      points: [300, 400, 310, 190, 230, 155, 155, 90, 200, 0, 450, 300],
      xAxis: months
    },
    weekly: {
      points: [320, 80, 600, 400],
      xAxis:['week1', 'week2', 'week3', 'week4']
    },
    daily: {
      points: [10, 50, 20, 190, 100, 70, 50],
      xAxis: days
    }
  },
  totalPoints: {
    overall: intialOverallPoints,
    thisMonth: 400,
    lastMonth: 320
  },
  level: Math.floor(intialOverallPoints / 100),
  tasks: {
    id: [],
    completed: {
      overall: 50,
      thisMonth: 16,
      lastMonth: 20
    },
    inProgress: {
      overall: 20,
      thisMonth: 7,
      lastMonth: 7
    }
  }
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
    setTotalPoints: (state, action) => {
      state.totalPoints.overall += action.payload
      state.level = Math.floor(state.totalPoints.overall / 100)
    },
    removeUnread: (state) => {
      state.unreadNotifications = 0
    },
    addTaskId: (state, action) => {
      state.tasks.id = state.tasks.id.push(action.payload)
    },
    removeTaskId: (state, action) => {
      state.tasks.id = state.tasks.id.filter((id) => id !== action.payload)
    }
  }
})

export const { 
  setName,
  setProfilePic,
  setLevel,
  setTotalPoints,
  removeUnread,
  addTaskId,
  removeTaskId
} = userSlice.actions

export default userSlice.reducer