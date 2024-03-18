import { createSlice } from'@reduxjs/toolkit'

const initialState = {
  tasks: [],
  tags: []
}

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.tasks.push(action.payload)
    },
    addTag: (state, action) => {
      const tag = action.payload.toLowerCase()
      if (!state.tags.includes(tag)) {
        state.tags.push(tag)
      }
    },
    editTask: (state, action) => {
      const { taskId, updatedTask } = action.payload
      const taskIndex = state.tasks.findIndex((task) => task.id === taskId)
      state.tasks[taskIndex] = {
        ...state.tasks[taskIndex],
        ...updatedTask
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
    },
    unfinishTask: (state, action) => {
      const taskIndex = state.tasks.findIndex((task) => task.id === action.payload)
      state.tasks[taskIndex] = {
        ...state.tasks[taskIndex],
        isCompleted: false
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
    removeTask: (state, action) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload)
    },
    removeStep: (state, action) => {
      const { taskId, stepId } = action.payload
      const taskIndex = state.tasks.findIndex((task) => task.id === taskId)
      state.tasks[taskIndex].steps = state.tasks[taskIndex].steps.filter((step) => step.id !== stepId)
    }
  }
})

export const {
  addTask,
  addTag,
  editTask,
  finishTask,
  unfinishTask,
  toggleStep,
  removeTask,
  removeStep
} =  tasksSlice.actions
export default tasksSlice.reducer