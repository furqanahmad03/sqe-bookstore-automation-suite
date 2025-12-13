import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

import Layout from '../components/Layout';
import Styles from './form.module.scss';
import CheckoutProgress from '../components/CheckoutProgress';
import { Store } from '../utils/Store';
import { useNotification } from '../components/NotificationProvider';

const Payment = () => {
	const paymentMethods = ['PayPal', 'Stripe', 'CashOnDelivery'];
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

	const { state, dispatch } = useContext(Store);
	const { cart } = state;
	const { shippingAddress, paymentMethod } = cart;
	const { showWarning } = useNotification();
	const router = useRouter();

	const submitHandler = (e) => {
		e.preventDefault();

		if (!selectedPaymentMethod) {
			showWarning('Please select a payment method');
			return;
		}

		dispatch({
			type: 'SAVE_PAYMENT_METHOD',
			payload: selectedPaymentMethod,
		});
		Cookies.set(
			'cart',
			JSON.stringify({
				...cart,
				paymentMethod: selectedPaymentMethod,
			})
		);

		router.push('/placeorder');
	};

	useEffect(() => {
		if (!shippingAddress.address) {
			return router.push('/shipping');
		}
		setSelectedPaymentMethod(paymentMethod || '');
	}, [paymentMethod, router, shippingAddress.address]);

	return (
		<Layout title="Payment Method">
			<div className="container">
				<CheckoutProgress activeStep={2} />
				<form 
					className={Styles.form} 
					onSubmit={submitHandler}
					data-testid="payment-form"
				>
					<h2 data-testid="page-title">Payment Method</h2>
					{paymentMethods.map((payment) => (
						<div key={payment} className={Styles.input_block}>
							<input
								name="paymentMethod"
								id={payment}
								type="radio"
								data-testid={`payment-${payment}`}
								checked={selectedPaymentMethod === payment}
								onChange={() =>
									setSelectedPaymentMethod(payment)
								}
							/>

							<label htmlFor={payment}>{payment}</label>
						</div>
					))}
					<div className={Styles.buttons_wrap}>
						<button
							className="button"
							onClick={() => router.push('/shipping')}
							type="button"
							data-testid="back-button"
						>
							Back
						</button>
						<button 
							className="button"
							type="submit"
							data-testid="next-button"
						>
							Next
						</button>
					</div>
				</form>
			</div>
		</Layout>
	);
};

Payment.auth = true;
export default Payment;