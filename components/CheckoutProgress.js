import Styles from './CheckoutProgress.module.scss';

const CheckoutProgress = ({ activeStep }) => {
	const steps = [
		'User Login',
		'Shipping Address',
		'Payment Method',
		'Place Order',
	];
	return (
		<div className={Styles.CheckoutProgress} data-testid="checkout-progress">
			<ul>
				{steps.map((step, index) => (
					<li 
						key={index}
						className={index <= activeStep ? Styles.active : ''}
						data-testid={`progress-step-${index}`}
						data-active={index <= activeStep}
					>
						{step}
					</li>
				))}
			</ul>
		</div>
	);
};

export default CheckoutProgress;