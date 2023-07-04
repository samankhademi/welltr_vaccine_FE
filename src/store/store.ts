import { configureStore } from '@reduxjs/toolkit'
import registrationReducer from '../pages/Order/orderSlice'
import profileReducer from "pages/Profile/profileSlice"
import thunk from 'redux-thunk';

export const store = configureStore({
  reducer: {
      registration: registrationReducer,
      profile: profileReducer
  },
  middleware: [thunk]
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch