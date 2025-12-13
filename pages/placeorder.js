import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import Cookies from 'js-cookie';

import CheckoutProgress from '../components/CheckoutProgress';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';
import { useNotification } from '../components/NotificationProvider';

import Styles from './order.module.scss';
import TableStyles from './table.module.scss';

export default function PlaceOrderScreen() {
	const { state, dispatch } = useContext(Store);
	const { showError } = useNotification();
	const { cart } = state;
	const { cartItems, shippingAddress, paymentMethod } = cart;

	const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;

	const itemsPrice = round2(
		cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
	);

	const shippingPrice = itemsPrice > 200 ? 0 : 15;
	const taxPrice = round2(itemsPrice * 0.15);
	const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

	const router = useRouter();
	useEffect(() => {
		if (!paymentMethod) {
			router.push('/payment');
		}
	}, [paymentMethod, router]);

	const [loading, setLoading] = useState(false);

	const placeOrderHandler = async () => {
		try {
			setLoading(true);
			const { data } = await axios.post('/api/orders', {
				orderItems: cartItems,
				shippingAddress,
				paymentMethod,
				itemsPrice,
				shippingPrice,
				taxPrice,
				totalPrice,
			});
			setLoading(false);
			dispatch({ type: 'CART_CLEAR_ITEMS' });
			Cookies.set(
				'cart',
				JSON.stringify({
					...cart,
					cartItems: [],
				})
			);
			router.push(`/order/${data._id}`);
		} catch (err) {
			setLoading(false);
			showError(err.message || 'Failed to place order');
		}
	};

	return (
		<Layout title="Place Order">
			<div className="container">
				<CheckoutProgress activeStep={3} />
				<h2 className={Styles.oder_page_title} data-testid="page-title">
					Place Order
				</h2>
				{cartItems.length === 0 ? (
					<div data-testid="empty-cart">
						Cart is empty. <Link href="/">Go shopping</Link>
					</div>
				) : (
					<div className={Styles.oder_page} data-testid="order-summary">
						<div className={Styles.oder_page_details}>
							<div className={Styles.action_block} data-testid="shipping-section">
								<h3>Shipping Address</h3>
								<p data-testid="shipping-address">
									{shippingAddress.fullName},{' '}
									{shippingAddress.address},{' '}
									{shippingAddress.city},{' '}
									{shippingAddress.postalCode},{' '}
									{shippingAddress.country}
								</p>
								<div>
									<Link href="/shipping" data-testid="edit-shipping">
										Edit
									</Link>
								</div>
							</div>
							<div className={Styles.action_block} data-testid="payment-section">
								<h3>Payment Method</h3>
								<p data-testid="payment-method">{paymentMethod}</p>
								<div>
									<Link href="/payment" data-testid="edit-payment">
										Edit
									</Link>
								</div>
							</div>
							<div className={Styles.action_block} data-testid="order-items-section">
								<h3>Order Items</h3>
								<div className={Styles.order_table}>
									<table className={TableStyles.table}>
										<thead>
											<tr>
												<th>Item</th>
												<th>Quantity</th>
												<th>Price</th>
												<th>Subtotal</th>
											</tr>
										</thead>
										<tbody>
											{cartItems.map((item, index) => (
												<tr key={item._id} data-testid={`order-item-${index}`}>
													<td>
														<Link
															href={`/books/${item.slug}`}
														>
															<strong data-testid={`item-name-${index}`}>
																{item.name}
															</strong>
														</Link>
													</td>
													<td data-testid={`item-quantity-${index}`}>
														{item.quantity}
													</td>
													<td data-testid={`item-price-${index}`}>
														${item.price}
													</td>
													<td data-testid={`item-subtotal-${index}`}>
														${item.quantity * item.price}
													</td>
												</tr>
											))}
											<tr>
												<td colSpan={4}>
													<div className="t-align-center">
														<Link href="/cart" data-testid="edit-cart">
															Edit
														</Link>
													</div>
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
						</div>
						<div className={Styles.oder_page_summary}>
							<div className={Styles.action_block} data-testid="order-summary-section">
								<h3>Order Summary</h3>
								<ul>
									<li>
										<div className={Styles.order_summary_row}>
											<div>Items</div>
											<div data-testid="items-price">
												${itemsPrice}
											</div>
										</div>
									</li>
									<li>
										<div className={Styles.order_summary_row}>
											<div>Tax</div>
											<div data-testid="tax-price">
												${taxPrice}
											</div>
										</div>
									</li>
									<li>
										<div className={Styles.order_summary_row}>
											<div>Shipping</div>
											<div data-testid="shipping-price">
												${shippingPrice}
											</div>
										</div>
									</li>
									<li>
										<div className={Styles.order_summary_row}>
											<div>Total</div>
											<div data-testid="total-price">
												${totalPrice}
											</div>
										</div>
									</li>
									<li>
										<button
											disabled={loading}
											onClick={placeOrderHandler}
											className={`${Styles.order_button} button`}
											data-testid="place-order-button"
										>
											{loading
												? 'Loading...'
												: 'Place Order'}
										</button>
									</li>
								</ul>
							</div>
						</div>
					</div>
				)}
			</div>
		</Layout>
	);
}

PlaceOrderScreen.auth = true;