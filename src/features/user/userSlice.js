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

const initialState = {
  name: 'Jessica Lambert',
  profilePic: require('../../Images/profile-pic.jpeg'),
  level: 3,
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
  tasksProgress: {
    completed: {
      overall: 27,
      thisMonth: 20,
      lastMonth: 16
    },
    inProgress: {
      overall: 8,
      thisMonth: 7,
      lastMonth: 7
    },
    points: {
      overall: 270,
      thisMonth: 27,
      lastMonth: 30
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