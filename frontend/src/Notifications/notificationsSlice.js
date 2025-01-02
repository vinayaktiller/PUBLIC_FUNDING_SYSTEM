import { createSlice } from "@reduxjs/toolkit";

const notificationsSlice = createSlice({
    name: "notifications",
    initialState: {
        notifications: [],
        socket: null,
        isConnected: false,
    },
    reducers: {
        addNotification(state, action) {
            state.notifications.push(action.payload);
        },
        removeNotification(state, action) {
            const notificationId = action.payload;
            state.notifications = state.notifications.filter(
                (notification) => notification.notificationId !== notificationId
            );
        },
        setSocket(state, action) {
            state.socket = action.payload;
        },
        setConnected(state, action) {
            state.isConnected = action.payload;
        },
    },
});

export const { addNotification, removeNotification, setSocket, setConnected } = notificationsSlice.actions;
export default notificationsSlice.reducer;

