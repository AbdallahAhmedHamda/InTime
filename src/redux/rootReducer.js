import { combineReducers } from 'redux'
import navigationReducer from '../features/navigation/navigationSlice'
import userReducer from '../features/user/userSlice'
import tasksReducer from '../features/tasks/tasksSlice'

const rootReducer = combineReducers({
  navigation: navigationReducer,
  user: userReducer,
  tasks: tasksReducer
})

export default rootReducer