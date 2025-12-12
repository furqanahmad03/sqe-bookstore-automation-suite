import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useReducer } from 'react';
import Layout from '../components/Layout';
import TableStyles from './table.module.scss';

function reducer(state, action) {
	switch (action.type) {
		case 'FETCH_REQUEST':
			return { ...state, loading: true, error: '' };
		case 'FETCH_SUCCESS':
			return {
				...state,
				loading: false,
				orders: action.payload,
				error: '',
			};
		case 'FETCH_FAIL':
			return { ...state, loading: false, error: action.payload };
		default:
			return state;
	}
}
function OrderHistoryScreen() {
	const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
		loading: true,
		orders: [],
		error: '',
	});

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				dispatch({ type: 'FETCH_REQUEST' });
				const { data } = await axios.get(`/api/orders/history`);
				dispatch({ type: 'FETCH_SUCCESS', payload: data });
			} catch (err) {
				dispatch({ type: 'FETCH_FAIL', payload: err.message });
			}
		};
		fetchOrders();
	}, []);
	return (
		<Layout title="Order History">
			<div className="container">
				<h2>Order History</h2>
				{loading ? (
					<div>Loading...</div>
				) : error ? (
					<div className="alert-error">{error}</div>
				) : (
					<div className={TableStyles.table_wrap}>
						<table className={TableStyles.table}>
							<thead>
								<tr>
									<th>Id</th>
									<th>Date</th>
									<th>Total</th>
									<th>Paid</th>
									<th>Delivered</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								{orders.map((order) => (
									<tr key={order._id}>
										<td>{order._id.substring(20, 24)}</td>
										<td>
											{order.createdAt.substring(0, 10)}
										</td>
										<td>${order.totalPrice}</td>
										<td>
											{order.isPaid
												? `${order.paidAt.substring(
														0,
														10
												  )}`
												: 'not paid'}
										</td>
										<td>
											{order.isDelivered
												? `${order.deliveredAt.substring(
														0,
														10
												  )}`
												: 'not delivered'}
										</td>
										<td className={TableStyles.table_link}>
											<Link
												href={`/order/${order._id}`}
												passHref
											>
												Details
											</Link>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</Layout>
	);
}

OrderHistoryScreen.auth = true;
export default OrderHistoryScreen;
