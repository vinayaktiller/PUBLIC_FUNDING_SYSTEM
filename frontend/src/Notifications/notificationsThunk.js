export const connectWebSocket = (userId) => (dispatch, getState) => {
    const { notifications } = getState();
    if (notifications.isConnected || notifications.socket) {
      console.log("WebSocket already connected");
      return;
    }
    const socket = new WebSocket(`ws://localhost:8000/ws/notifications/${userId}/`);
    socket.onopen = () => {
      console.log("WebSocket connected");
      dispatch({ type: "notifications/setConnected", payload: true });
    };
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received data:", data); // Added console log to see received data
      if (data.notification) {
        dispatch({ type: "notifications/addNotification", payload: data.notification });
      }
    };
    socket.onclose = () => {
      console.log("WebSocket closed");
      dispatch({ type: "notifications/setConnected", payload: false });
    };
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
    dispatch({ type: "notifications/setSocket", payload: socket });
  };
  
  export const disconnectWebSocket = () => (dispatch, getState) => {
    const { notifications } = getState();
    if (notifications.socket) {
      notifications.socket.close();
      dispatch({ type: "notifications/setSocket", payload: null });
      dispatch({ type: "notifications/setConnected", payload: false });
    }
  };
  
  export const sendWebSocketResponse = (notificationId, response) => (dispatch, getState) => {
    const { notifications } = getState();
    if (notifications.socket && notifications.socket.readyState === WebSocket.OPEN) {
      const responseMessage = JSON.stringify({ notificationId, response });
      notifications.socket.send(responseMessage);
      console.log(`Sent response: ${responseMessage}`);
    } else {
      console.error("WebSocket is not connected or is closed.");
    }
  };
  