import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: "",
  user: {},
  isSuperAdmin: false,
  notificationsUnReaded: 0
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isSuperAdmin = action.payload.isSuperAdmin
    },
    updateUserInfo(state, action) {
      state.user = action.payload;
    },
    logout(state) {
      state.token = "";
      state.user = {};
      state.isSuperAdmin = false;
      state.notificationsUnReaded=0;
    },
    updateNotificationUnReaded(state, action) {
      state.notificationsUnReaded = action.payload.notificationsUnReaded;
      
    },
  },
});

export default authSlice.reducer;
export const { login, logout, updateUserInfo, updateNotificationUnReaded } = authSlice.actions;
