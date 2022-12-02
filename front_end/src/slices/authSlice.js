import { createSlice } from "@reduxjs/toolkit"

const authSlice = createSlice({
    name: 'auth',
    //this are the states
    initialState: {
        // user is not logged in
        status: false,
        authData: null
    },
    //what will happen in that action actual B.L.
    reducers: {
        signin: (state, action) => {
          // the user is now signed in
          state.status = true
          state.authData = action.payload
          sessionStorage['token'] = action.payload['token']
          sessionStorage['roleId'] = action.payload['roleId']
        },
        signout: (state, action) => {
          // the user is signed out
          state.status = false
          state.authData = null
          // remove the user token and name from sessionStorage
          sessionStorage.clear();
        },
        updateAuthdata: (state, action) => {
          state.authData.status = action.payload
        }
      },
})

// export the reducer for authSlice
export default authSlice.reducer

// export the actions ****
export const { signin, signout, updateAuthdata } = authSlice.actions