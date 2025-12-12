import { createContext, useContext, useState, useCallback } from 'react';
import Notification from './Notification';

const NotificationContext = createContext();

export function useNotification() {
	const context = useContext(NotificationContext);
	if (!context) {
		throw new Error('useNotification must be used within NotificationProvider');
	}
	return context;
}

export function NotificationProvider({ children }) {
	const [notifications, setNotifications] = useState([]);

	const showNotification = useCallback((message, type = 'error', duration = 5000) => {
		const id = Date.now() + Math.random();
		const notification = { id, message, type, duration };
		
		setNotifications((prev) => [...prev, notification]);
		
		return id;
	}, []);

	const removeNotification = useCallback((id) => {
		setNotifications((prev) => prev.filter((n) => n.id !== id));
	}, []);

	const showSuccess = useCallback((message, duration) => {
		return showNotification(message, 'success', duration);
	}, [showNotification]);

	const showError = useCallback((message, duration) => {
		return showNotification(message, 'error', duration);
	}, [showNotification]);

	const showWarning = useCallback((message, duration) => {
		return showNotification(message, 'warning', duration);
	}, [showNotification]);

	const showInfo = useCallback((message, duration) => {
		return showNotification(message, 'info', duration);
	}, [showNotification]);

	return (
		<NotificationContext.Provider
			value={{
				showNotification,
				showSuccess,
				showError,
				showWarning,
				showInfo,
				removeNotification,
			}}
		>
			{children}
			<div style={{ position: 'fixed', top: 0, right: 0, zIndex: 10000, pointerEvents: 'none', padding: '20px' }}>
				{notifications.map((notification, index) => (
					<div
						key={notification.id}
						style={{
							pointerEvents: 'auto',
							marginBottom: '10px',
						}}
					>
						<Notification
							message={notification.message}
							type={notification.type}
							duration={notification.duration}
							onClose={() => removeNotification(notification.id)}
						/>
					</div>
				))}
			</div>
		</NotificationContext.Provider>
	);
}

