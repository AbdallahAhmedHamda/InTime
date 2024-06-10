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
  id: 1,
  name: '',
  email: '',
  phone: '',
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
    overall: 0,
    thisMonth: 400,
    lastMonth: 320
  },
  level: Math.floor(0 / 100) + 1,
  tasks: [],
  completedTasks: {
    thisMonth: 16,
    lastMonth: 20
  },
  tags: []
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setName: (state, action) => {
      state.name = action.payload
    },
    setEmail: (state, action) => {
      state.email = action.payload
    },
    setPhone: (state, action) => {
      state.phone = action.payload
    },
    setProfilePic: (state, action) => {
      state.profilePic = action.payload
    },
    removeUnread: (state) => {
      state.unreadNotifications = 0
    },
    addTask: (state, action) => {
      state.tasks.push(action.payload)
    },
    editTask: (state, action) => {
      const { taskId, updatedTask } = action.payload
      const taskIndex = state.tasks.findIndex((task) => task.id === taskId)
      const taskOldTag = state.tasks[taskIndex].tag.name
      const tagExists = state.tasks.some((task) => task.tag.name === taskOldTag)

      state.tasks[taskIndex] = {
        ...state.tasks[taskIndex],
        ...updatedTask
      }

      if (!tagExists) {
        const newTags = [...state.tags]
        const tagIndex = state.tags.findIndex((tag) => tag === taskOldTag)

        newTags[tagIndex] = null

        state.tags = newTags
      }
    },
    finishTask: (state, action) => {
      const taskIndex = state.tasks.findIndex((task) => task.id === action.payload)

      state.tasks[taskIndex] = {
        ...state.tasks[taskIndex],
        steps: [...state.tasks[taskIndex].steps.map(step => ({
          ...step,
          isCompleted: true
        }))],
        isCompleted: true
      }

      const dailyLastIndex = state.points.daily.points.length - 1
      state.points.daily.points = [
        ...state.points.daily.points.slice(0, dailyLastIndex),
        state.points.daily.points[dailyLastIndex] + 20
      ]

      const weeklyLastIndex = state.points.weekly.points.length - 1
      state.points.weekly.points = [
        ...state.points.weekly.points.slice(0, weeklyLastIndex),
        state.points.weekly.points[weeklyLastIndex] + 20
      ]

      const monthlyLastIndex = state.points.monthly.points.length - 1
      state.points.monthly.points = [
        ...state.points.monthly.points.slice(0, monthlyLastIndex),
        state.points.monthly.points[monthlyLastIndex] + 20
      ]

      state.totalPoints.overall += 20
      state.level = Math.floor(state.totalPoints.overall / 100) + 1
      
      state.completedTasks = {
        ...state.completedTasks,
        thisMonth: state.completedTasks.thisMonth + 1
      }
    },
    unfinishTask: (state, action) => {
      const taskIndex = state.tasks.findIndex((task) => task.id === action.payload)

      state.tasks[taskIndex] = {
        ...state.tasks[taskIndex],
        isCompleted: false
      }

      const dailyLastIndex = state.points.daily.points.length - 1
      state.points.daily.points = [
        ...state.points.daily.points.slice(0, dailyLastIndex),
        state.points.daily.points[dailyLastIndex] - 20
      ]

      const weeklyLastIndex = state.points.weekly.points.length - 1
      state.points.weekly.points = [
        ...state.points.weekly.points.slice(0, weeklyLastIndex),
        state.points.weekly.points[weeklyLastIndex] - 20
      ]

      const monthlyLastIndex = state.points.monthly.points.length - 1
      state.points.monthly.points = [
        ...state.points.monthly.points.slice(0, monthlyLastIndex),
        state.points.monthly.points[monthlyLastIndex] - 20
      ]

      state.completedTasks = {
        ...state.completedTasks,
        thisMonth: state.completedTasks.thisMonth - 1
      }

      state.totalPoints.overall -= 20
      state.level = Math.floor(state.totalPoints.overall / 100) + 1
    },
    removeTask: (state, action) => {
      const { taskId, taskTag } = action.payload

      state.tasks = state.tasks.filter((task) => task.id !== taskId)

      const tagExists = state.tasks.some((task) => task.tag.name === taskTag)

      if (!tagExists) {
        const newTags = [...state.tags]
        const tagIndex = state.tags.findIndex((tag) => tag === taskTag)

        newTags[tagIndex] = null

        state.tags = newTags
      }
    },
    toggleStep: (state, action) => {
      const { taskId, stepId } = action.payload
      const taskIndex = state.tasks.findIndex((task) => task.id === taskId)
      const stepIndex = state.tasks[taskIndex].steps.findIndex((step) => step.id === stepId)
      
      state.tasks[taskIndex].steps[stepIndex] = {
        ...state.tasks[taskIndex].steps[stepIndex],
        isCompleted: !state.tasks[taskIndex].steps[stepIndex].isCompleted
      }
    },
    removeStep: (state, action) => {
      const { taskId, stepId } = action.payload
      const taskIndex = state.tasks.findIndex((task) => task.id === taskId)

      state.tasks[taskIndex].steps = state.tasks[taskIndex].steps.filter((step) => step.id !== stepId)
    },
    addTag: (state, action) => {
      const tag = action.payload.toLowerCase()

      if (!state.tags.includes(tag)) {
        state.tags.push(tag)
      }
    }
  }
})

export const { 
  setName,
  setEmail,
  setPhone,
  setProfilePic,
  removeUnread,
  addTask,
  editTask,
  finishTask,
  unfinishTask,
  removeTask,
  toggleStep,
  removeStep,
  addTag
} = userSlice.actions

export default userSlice.reducer