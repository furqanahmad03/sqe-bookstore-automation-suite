import { useEffect, useState } from 'react';
import Styles from './Notification.module.scss';

export default function Notification({ message, type = 'error', onClose, duration = 5000 }) {
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		if (duration > 0) {
			const timer = setTimeout(() => {
				setIsVisible(false);
				setTimeout(() => {
					if (onClose) onClose();
				}, 300); // Wait for fade out animation
			}, duration);

			return () => clearTimeout(timer);
		}
	}, [duration, onClose]);

	const handleClose = () => {
		setIsVisible(false);
		setTimeout(() => {
			if (onClose) onClose();
		}, 300);
	};

	if (!message) return null;

	return (
		<div className={`${Styles.notification} ${Styles[type]} ${isVisible ? Styles.visible : Styles.hidden}`}>
			<div className={Styles.content}>
				<span className={Styles.icon}>
					{type === 'success' && '✓'}
					{type === 'error' && '✗'}
					{type === 'warning' && '⚠'}
					{type === 'info' && 'ℹ'}
				</span>
				<span className={Styles.message}>{message}</span>
				<button className={Styles.close} onClick={handleClose} aria-label="Close">
					×
				</button>
			</div>
		</div>
	);
}

