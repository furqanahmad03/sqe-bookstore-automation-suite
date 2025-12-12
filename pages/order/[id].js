import { useEffect, useReducer } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

import axios from 'axios';

import Layout from '../../components/Layout';

import Styles from '../order.module.scss';
import TableStyles from '../table.module.scss';

function reducer(state, action) {
	switch (action.type) {
		case 'FETCH_REQUEST':
			return { ...state, loading: true, error: '' };
		case 'FETCH_SUCCESS':
			return {
				...state,
				loading: false,
				order: action.payload,
				error: '',
			};
		case 'FETCH_FAIL':
			return { ...state, loading: false, error: action.payload };
		default:
			state;
	}
}
function OrderScreen() {
	// order/:id
	const { query } = useRouter();
	const orderId = query.id;

	const [{ loading, error, order }, dispatch] = useReducer(reducer, {
		loading: true,
		order: {},
		error: '',
	});
	useEffect(() => {
		const fetchOrder = async () => {
			try {
				dispatch({ type: 'FETCH_REQUEST' });
				const { data } = await axios.get(`/api/orders/${orderId}`);
				dispatch({ type: 'FETCH_SUCCESS', payload: data });
			} catch (err) {
				dispatch({ type: 'FETCH_FAIL', payload: err.message });
			}
		};
		if (!order._id || (order._id && order._id !== orderId)) {
			fetchOrder();
		}
	}, [order, orderId]);
	const {
		shippingAddress,
		paymentMethod,
		orderItems,
		itemsPrice,
		taxPrice,
		shippingPrice,
		totalPrice,
		isPaid,
		paidAt,
		isDelivered,
		deliveredAt,
	} = order;

	let oderTitle;
	if (orderItems) {
		oderTitle = `"${orderItems[0].name}" ${
			orderItems.length > 1 ? `and ${orderItems.length - 1}  other` : ''
		}`;
	} else {
		oderTitle = orderId;
	}

	return (
		<Layout title={`Your order of ${oderTitle}`}>
			<div className="container">
				<h2
					className={Styles.oder_page_title}
				>{`Your order of ${oderTitle}`}</h2>
				{loading ? (
					<div>Loading...</div>
				) : error ? (
					<div className="alert-error">{error}</div>
				) : (
					<div className={Styles.oder_page}>
						<div className={Styles.oder_page_details}>
							<div className={Styles.action_block}>
								<h3>Shipping Address</h3>
								<div>
									{shippingAddress.fullName},{' '}
									{shippingAddress.address},{' '}
									{shippingAddress.city},{' '}
									{shippingAddress.postalCode},{' '}
									{shippingAddress.country}
								</div>
								{isDelivered ? (
									<div className={Styles.status_success}>
										Delivered at {deliveredAt}
									</div>
								) : (
									<div className={Styles.status_success}>
										Not delivered
									</div>
								)}
							</div>

							<div className={Styles.action_block}>
								<h3>Payment Method</h3>
								<div>{paymentMethod}</div>
								{isPaid ? (
									<div className={Styles.status_success}>
										Paid at {paidAt}
									</div>
								) : (
									<div className={Styles.status_error}>
										Not paid
									</div>
								)}
							</div>

							<div className={Styles.action_block}>
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
											{orderItems.map((item) => (
												<tr key={item._id}>
													<td>
														<Link
															href={`/product/${item.slug}`}
															legacyBehavior
														>
															<a
																className={
																	Styles.product_name
																}
															>
																<Image
																	src={
																		item.image
																	}
																	alt={
																		item.name
																	}
																	width={50}
																	height={50}
																></Image>
																<strong>
																	{item.name}
																</strong>
															</a>
														</Link>
													</td>
													<td>{item.quantity}</td>
													<td>${item.price}</td>
													<td>
														$
														{item.quantity *
															item.price}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						</div>
						<div className={Styles.oder_page_summary}>
							<div className={Styles.action_block}>
								<h3>Order Summary</h3>
								<ul>
									<li>
										<div
											className={Styles.order_summary_row}
										>
											<div>Items</div>
											<div>${itemsPrice}</div>
										</div>
									</li>{' '}
									<li>
										<div
											className={Styles.order_summary_row}
										>
											<div>Tax</div>
											<div>${taxPrice}</div>
										</div>
									</li>
									<li>
										<div
											className={Styles.order_summary_row}
										>
											<div>Shipping</div>
											<div>${shippingPrice}</div>
										</div>
									</li>
									<li>
										<div
											className={Styles.order_summary_row}
										>
											<div>Total</div>
											<div>${totalPrice}</div>
										</div>
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

OrderScreen.auth = true;
export default OrderScreen;
