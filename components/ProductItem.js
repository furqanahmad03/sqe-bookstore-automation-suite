/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { useContext } from 'react';

import { Store } from '../utils/Store';
import Styles from './ProductItem.module.scss';
import { useNotification } from './NotificationProvider';

export default function ProductItem({ product }) {
	const { state, dispatch } = useContext(Store);
	const { showWarning } = useNotification();

	const addToCart = async () => {
		const bookInCart = state.cart.cartItems.find(
			(item) => item.slug === product.slug
		);
		const quantity = bookInCart ? bookInCart.quantity + 1 : 1;

		let data = await fetch(`/api/product/${product._id}`);
		data = await data.json();
		if (Number(data.book.quantity) < Number(quantity)) {
			showWarning('Sorry, Product is out of stock now');
			return;
		}
		dispatch({
			type: 'CART_ADD_ITEM',
			payload: {
				...product,
				quantity,
				stockQuantity: data.book.quantity,
			},
		});
	};

	return (
		<div className={Styles.book_item}>
			<div className={Styles.book_item_body}>
				<h3>
					<Link href={`/books/${product.slug}`}>
						{product.name}
					</Link>
				</h3>
				<p className={Styles.book_author}>By {product.author}</p>
				<p className={Styles.book_description}>{product.description}</p>
				<div className={Styles.book_add_cart}>
					<p className={Styles.book_price}>${product.price}</p>
					<button
						onClick={() => addToCart()}
						className={`${Styles.book_button} button`}
						disabled={product.quantity > 0 ? '' : 'disabled'}
					>
						{product.quantity > 0
							? 'Add To Cart'
							: 'Out Of Stock'}
					</button>
				</div>
			</div>
		</div>
	);
}
