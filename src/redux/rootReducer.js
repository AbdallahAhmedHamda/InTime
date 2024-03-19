import { combineReducers } from 'redux'
import navigationReducer from '../features/navigation/navigationSlice'
import userReducer from '../features/user/userSlice'

const rootReducer = combineReducers({
  navigation: navigationReducer,
  user: userReducer,
})

export default rootReducer