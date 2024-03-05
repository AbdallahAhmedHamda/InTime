import { createSlice } from'@reduxjs/toolkit'

const initialState = {
  tasks: []
}

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.tasks.push(action.payload)
    },
    editTask: (state, action) => {
      const { taskId, updatedTask } = action.payload
      const taskIndex = state.tasks.findIndex(task => task.id === taskId)
      state.tasks[taskIndex] = {...state.tasks[taskIndex], ...updatedTask}
    },
    finishTask: (state, action) => {
      const taskIndex = state.tasks.findIndex(task => task.id === action.payload)
      state.tasks[taskIndex] = {...state.tasks[taskIndex], isCompleted: true}
    },
    finishStep: (state, action) => {
      const { taskId, stepId } = action.payload
      const taskIndex = state.tasks.findIndex(task => task.id === taskId)
      const stepIndex = state.tasks[taskIndex].steps.findIndex(step => step.id === stepId)
      state.tasks[taskIndex].steps[stepIndex] = {...state.tasks[taskIndex].steps[stepIndex], isCompleted: true}
    },
    removeTask: (state, action) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload)
    },
    removeStep: (state, action) => {
      const { taskId, stepId } = action.payload
      const taskIndex = state.tasks.findIndex(task => task.id === taskId)
      state.tasks[taskIndex].steps = state.tasks[taskIndex].steps.filter(step => step.id !== stepId)
    }
  }
})

export const {
  addTask,
  editTask,
  finishTask,
  finishStep,
  removeTask,
  removeStep
} =  tasksSlice.actions
export default tasksSlice.reducer