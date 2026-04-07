import { createSlice } from '@reduxjs/toolkit';

const storedUser = JSON.parse(localStorage.getItem('movieUser') || 'null');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: storedUser,
    token: localStorage.getItem('movieToken') || null,
    isAuthenticated: !!storedUser,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('movieUser', JSON.stringify(action.payload));
      localStorage.setItem('movieToken', action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('movieUser');
      localStorage.removeItem('movieToken');
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
