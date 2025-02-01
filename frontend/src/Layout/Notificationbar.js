import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendWebSocketResponse } from "../Notifications/notificationsThunk";
import { removeNotification } from "../Notifications/notificationsSlice";

function NotificationBar() {
    const dispatch = useDispatch();
    const notifications = useSelector((state) => state.notifications.notifications);

    const handleResponse = (notificationId, response) => {
        dispatch(sendWebSocketResponse(notificationId, response)); // Send the response
        dispatch(removeNotification(notificationId)); // Remove the notification
    };

    return (
        <div className="noti">
            <h3>Notifications</h3>
            {notifications.length === 0 ? (
                <p>No notifications yet</p>
            ) : (
                <ul>
                    { notifications.map((notification, index) => {
                        console.log(notification);
                        
                        return(
                        <li key={index}>
                            <p>{notification.message}</p>
                            
                            <button onClick={() => handleResponse(notification.notificationId, "yes")}>Yes</button>
                            <button onClick={() => handleResponse(notification.notificationId, "no")}>No</button>
                        </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

export default NotificationBar;
