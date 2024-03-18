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
  id: 1,
  name: 'Jessica Lambert',
  profilePic: require('../../assets/images/profile-pic.jpeg'),
  unreadNotifications: 2,
  points: {
    daily: {
      points: [10, 50, 20, 190, 100, 70, 50],
      xAxis: days
    },
    weekly: {
      points: [320, 80, 600, 400],
      xAxis:['week1', 'week2', 'week3', 'week4']
    },
    monthly: {
      points: [300, 400, 310, 190, 230, 155, 155, 90, 200, 0, 450, 300],
      xAxis: months
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
    inProgress: 20
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
    addPoints: (state, action) => {
      const dailyLastIndex = state.points.daily.points.length - 1
      state.points.daily.points = [
        ...state.points.daily.points.slice(0, dailyLastIndex),
        state.points.daily.points[dailyLastIndex] + action.payload
      ]

      const weeklyLastIndex = state.points.weekly.points.length - 1
      state.points.weekly.points = [
        ...state.points.weekly.points.slice(0, weeklyLastIndex),
        state.points.weekly.points[weeklyLastIndex] + action.payload
      ]

      const monthlyLastIndex = state.points.monthly.points.length - 1
      state.points.monthly.points = [
        ...state.points.monthly.points.slice(0, monthlyLastIndex),
        state.points.monthly.points[monthlyLastIndex] + action.payload
      ]

      state.tasks.completed = {
        ...state.tasks.completed,
        overall: state.tasks.completed.overall + 1,
        thisMonth: state.tasks.completed.thisMonth + 1
      }

      state.tasks.inProgress -= 1
      state.totalPoints.overall += action.payload
      state.level = Math.floor(state.totalPoints.overall / 100)
    },
    deductPoints: (state, action) => {
      const dailyLastIndex = state.points.daily.points.length - 1
      state.points.daily.points = [
        ...state.points.daily.points.slice(0, dailyLastIndex),
        state.points.daily.points[dailyLastIndex] - action.payload
      ]

      const weeklyLastIndex = state.points.weekly.points.length - 1
      state.points.weekly.points = [
        ...state.points.weekly.points.slice(0, weeklyLastIndex),
        state.points.weekly.points[weeklyLastIndex] - action.payload
      ]

      const monthlyLastIndex = state.points.monthly.points.length - 1
      state.points.monthly.points = [
        ...state.points.monthly.points.slice(0, monthlyLastIndex),
        state.points.monthly.points[monthlyLastIndex] - action.payload
      ]

      state.tasks.completed = {
        ...state.tasks.completed,
        overall: state.tasks.completed.overall - 1,
        thisMonth: state.tasks.completed.thisMonth - 1
      }

      state.tasks.inProgress += 1
      state.totalPoints.overall -= action.payload
      state.level = Math.floor(state.totalPoints.overall / 100)
    },
    removeUnread: (state) => {
      state.unreadNotifications = 0

    },
    addTaskId: (state, action) => {
      state.tasks.inProgress += 1
      state.tasks.id.push(action.payload)
    },
    removeTaskId: (state, action) => {
      const { taskId, isCompleted, backlog } = action.payload

       if (!isCompleted && !backlog) {
        state.tasks.inProgress -= 1
       }

      state.tasks.id = state.tasks.id.filter((id) => id !== taskId)
    }
  }
})

export const { 
  setName,
  setProfilePic,
  setLevel,
  addPoints,
  deductPoints,
  removeUnread,
  addTaskId,
  removeTaskId
} = userSlice.actions

export default userSlice.reducer