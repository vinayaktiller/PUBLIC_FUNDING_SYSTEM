import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
   name: 'user',
   initialState: {
       isLoggedIn: false,
       user_email: '',
   },
   reducers: {
       login(state, action) {
           state.isLoggedIn = true;
           state.user_email = action.payload.user_email;
       },
       logout(state) {
           state.isLoggedIn = false;
           state.user_email = '';
       },
   },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
