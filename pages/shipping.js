import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import { Store } from '../utils/Store';
import { useRouter } from 'next/router';

import CheckoutProgress from '../components/CheckoutProgress';
import Layout from '../components/Layout';
import Styles from './form.module.scss';

const ShippingScreen = () => {
	const {
		handleSubmit,
		register,
		formState: { errors },
		setValue,
	} = useForm();

	const { state, dispatch } = useContext(Store);
	const { cart } = state;
	const router = useRouter();
	const { shippingAddress } = cart;

	useEffect(() => {
		setValue('fullName', shippingAddress.fullName);
		setValue('address', shippingAddress.address);
		setValue('city', shippingAddress.city);
		setValue('postalCode', shippingAddress.postalCode);
		setValue('country', shippingAddress.country);
	}, [setValue, shippingAddress]);

	const submitHandler = ({
		fullName,
		address,
		city,
		postalCode,
		country,
	}) => {
		dispatch({
			type: 'SAVE_SHIPPING_ADDRESS',
			payload: { fullName, address, city, postalCode, country },
		});
		Cookies.set(
			'cart',
			JSON.stringify({
				...cart,
				shippingAddress: {
					fullName,
					address,
					city,
					postalCode,
					country,
				},
			})
		);

		router.push('/payment');
	};

	return (
		<Layout title="Shipping Address">
			<div className="container">
				<CheckoutProgress activeStep={1} />
				<form
					className={Styles.form}
					onSubmit={handleSubmit(submitHandler)}
					data-testid="shipping-form"
				>
					<h2 data-testid="page-title">Shipping Address</h2>

					<label htmlFor="fullName">Full Name</label>
					<input
						id="fullName"
						data-testid="fullName-input"
						autoFocus
						{...register('fullName', {
							required: 'Please enter full name',
						})}
					/>
					{errors.fullName && (
						<span className={Styles.error} data-testid="fullName-error">
							{errors.fullName.message}
						</span>
					)}

					<label htmlFor="address">Address</label>
					<input
						id="address"
						data-testid="address-input"
						{...register('address', {
							required: 'Please enter address',
							minLength: {
								value: 3,
								message: 'Address is more than 2 chars',
							},
						})}
					/>
					{errors.address && (
						<span className={Styles.error} data-testid="address-error">
							{errors.address.message}
						</span>
					)}

					<label htmlFor="city">City</label>
					<input
						id="city"
						data-testid="city-input"
						{...register('city', {
							required: 'Please enter city',
						})}
					/>
					{errors.city && (
						<span className={Styles.error} data-testid="city-error">
							{errors.city.message}
						</span>
					)}

					<label htmlFor="postalCode">Postal Code</label>
					<input
						id="postalCode"
						data-testid="postalCode-input"
						{...register('postalCode', {
							required: 'Please enter postal code',
						})}
					/>
					{errors.postalCode && (
						<span className={Styles.error} data-testid="postalCode-error">
							{errors.postalCode.message}
						</span>
					)}

					<label htmlFor="country">Country</label>
					<input
						id="country"
						data-testid="country-input"
						{...register('country', {
							required: 'Please enter country',
						})}
					/>
					{errors.country && (
						<span className={Styles.error} data-testid="country-error">
							{errors.country.message}
						</span>
					)}

					<button type="submit" className="button" data-testid="next-button">
						Next
					</button>
				</form>
			</div>
		</Layout>
	);
};

ShippingScreen.auth = true;

export default ShippingScreen;