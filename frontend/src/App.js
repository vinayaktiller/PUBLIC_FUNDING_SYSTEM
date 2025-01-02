import './App.css';
import { useDispatch } from "react-redux";
import { connectWebSocket, disconnectWebSocket } from "./Notifications/notificationsThunk";
import AppRoutes from './AppRoutes';
import { useEffect } from 'react';
function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (userId) {
        dispatch(connectWebSocket(userId));
    }

    return () => {
        dispatch(disconnectWebSocket());
    };
  }, [dispatch]); 
  return (
    <div>
      <AppRoutes />
      
    </div>  
  );
}

export default App;
