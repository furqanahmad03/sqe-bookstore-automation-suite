/* eslint-disable @next/next/no-img-element */
import { useContext } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import { Store } from '../utils/Store';
import Styles from './cart.module.scss';
import TableStyles from './table.module.scss';

import Layout from '../components/Layout';
import Notice from '../components/Notice';
import { useNotification } from '../components/NotificationProvider';

const Cart = () => {
	const router = useRouter();
	const { state, dispatch } = useContext(Store);
	const { showWarning } = useNotification();
	const {
		cart: { cartItems },
	} = state;

	const removeProduct = (slug) => {
		dispatch({
			type: 'CART_REMOVE_ITEM',
			payload: slug,
		});
	};

	const cartUpdateHandler = async (item, quantity) => {
		let data = await fetch(`/api/product/${item._id}`);
		data = await data.json();
		if (Number(data.book.quantity) < Number(quantity)) {
			showWarning('Sorry, Product is out of stock now');
			return;
		}
		dispatch({
			type: 'CART_ADD_ITEM',
			payload: {
				...item,
				quantity,
				stockQuantity: data.book.quantity,
			},
		});
	};

	const TotalPrice = cartItems.reduce((acc, item) => {
		return acc + item.price * item.quantity;
	}, 0);

	const TotalQuantity = cartItems.reduce((acc, item) => {
		return acc + item.quantity;
	}, 0);

	return (
		<Layout>
			<div className="container">
				<div className={Styles.cart_page}>
					<h2 data-testid="cart-page-title">Cart</h2>
					{cartItems.length == 0 ? (
						<Notice>
							<p data-testid="empty-cart-message">
								No items added in cart{' '}
								<Link href="/" data-testid="continue-shopping-link">
									Go shopping
								</Link>
							</p>
						</Notice>
					) : (
						<div className={Styles.cart_page_inner}>
							<div className={Styles.cart_table} data-testid="cart-table">
								<table className={TableStyles.table}>
									<thead>
										<tr>
											<th className={Styles.item_th}>
												Item
											</th>
											<th className={Styles.quantity_th}>
												Quantity
											</th>
											<th>Price</th>
											<th>Action</th>
										</tr>
									</thead>
									<tbody>
										{cartItems.map((item, index) => (
											<tr 
												key={item.slug} 
												data-testid={`cart-item-${index}`}
												data-item-name={item.name}
												data-item-slug={item.slug}
											>
												<td>
													<Link
														href={`/books/${item.slug}`}
														data-testid={`cart-item-link-${index}`}
													>
														<strong 
															data-testid={`cart-item-name-${index}`}
															className={Styles.product_name}
														>
															{item.name}
														</strong>
													</Link>
												</td>
												<td>
													<button
														className={`${Styles.action_button} button`}
														disabled={
															item.quantity === 1
																? 'disabled'
																: 0
														}
														onClick={() => {
															cartUpdateHandler(
																item,
																item.quantity -
																	1
															);
														}}
														data-testid={`decrease-quantity-${index}`}
													>
														-
													</button>
													<span
														className={
															Styles.cart_number
														}
														data-testid={`item-quantity-${index}`}
													>
														{item.quantity}
													</span>
													<button
														className={`${Styles.action_button} button`}
														disabled={
															(item.stockQuantity || item.quantity) <=
															item.quantity
																? 'disabled'
																: 0
														}
														onClick={() => {
															cartUpdateHandler(
																item,
																item.quantity +
																	1
															);
														}}
														data-testid={`increase-quantity-${index}`}
													>
														+
													</button>
												</td>
												<td data-testid={`item-price-${index}`}>${item.price}</td>
												<td>
													<button
														className={
															Styles.remove_product
														}
														onClick={() =>
															removeProduct(
																item.slug
															)
														}
														data-testid={`remove-item-${index}`}
														aria-label={`Remove ${item.name}`}
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															fill="none"
															viewBox="0 0 24 24"
															strokeWidth={1.5}
															stroke="currentColor"
															height="24px"
															width="24px"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
															/>
														</svg>
														<span>
															Remove Product
														</span>
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
							<div className={Styles.cart_action_block} data-testid="cart-summary">
								<div>
									<p>
										Quantity:{' '}
										<strong data-testid="total-quantity">{TotalQuantity}</strong>
									</p>
									<p>
										Subtotal: <strong data-testid="total-price">${TotalPrice}</strong>
									</p>
								</div>
								<Link href="/login?redirect=/shipping">
									<button
										className={`${Styles.checkout_button} button`}
										data-testid="checkout-button"
									>
										Checkout
									</button>
								</Link>
							</div>
						</div>
					)}
				</div>
			</div>
		</Layout>
	);
};

export default dynamic(() => Promise.resolve(Cart), { ssr: false });