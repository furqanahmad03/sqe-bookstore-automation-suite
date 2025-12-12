import Styles from './ConfirmModal.module.scss';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
	if (!isOpen) return null;

	return (
		<div className={Styles.overlay} onClick={onClose}>
			<div className={Styles.modal} onClick={(e) => e.stopPropagation()}>
				<div className={Styles.header}>
					<h3>{title || 'Confirm Action'}</h3>
				</div>
				<div className={Styles.body}>
					<p>{message || 'Are you sure you want to proceed?'}</p>
				</div>
				<div className={Styles.footer}>
					<button onClick={onClose} className={Styles.cancel_button}>
						Cancel
					</button>
					<button onClick={onConfirm} className={Styles.confirm_button}>
						Confirm
					</button>
				</div>
			</div>
		</div>
	);
}

