import Styles from './CheckoutProgress.module.scss';

const CheckoutProgress = ({ activeStep }) => {
	const steps = [
		'User Login',
		'Shipping Address',
		'Payment Method',
		'Place Order',
	];
	return (
		<div className={Styles.CheckoutProgress}>
			<ul>
				{steps.map((step, index) => (
					<li className={index <= activeStep ? Styles.active : ''}>
						{step}
					</li>
				))}
			</ul>
		</div>
	);
};

export default CheckoutProgress;
