import React, { useEffect, useState } from "react";

function NotificationBar() {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const userId = localStorage.getItem("user_id");
        if (!userId) {
            console.error("User ID not found in local storage");
            return;
        }

        const newSocket = new WebSocket(`ws://localhost:8000/ws/notifications/`);

        newSocket.onopen = () => {
            console.log("Connected to WebSocket server");
        };

        newSocket.onmessage = (event) => {
            const notification = JSON.parse(event.data).notification;
            setNotifications((prev) => [...prev, notification]);
        };

        newSocket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        newSocket.onclose = (event) => {
            console.log("WebSocket closed:", event);
        };

        return () => {
            newSocket.close();
        };
    }, []);

    return (
        <div className="noti">
            <h3>Notifications</h3>
            {notifications.length === 0 ? (
                <p>No notifications yet</p>
            ) : (
                <ul>
                    {notifications.map((notification, index) => (
                        <li key={index}>{notification}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default NotificationBar;
