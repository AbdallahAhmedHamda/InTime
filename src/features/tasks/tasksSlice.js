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
    removeTask: (state, action) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload)
    }
  }
})

export const {
  addTask,
  editTask,
  removeTask
} =  tasksSlice.actions

export default tasksSlice.reducer