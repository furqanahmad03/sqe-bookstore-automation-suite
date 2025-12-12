import { useRouter } from 'next/router';
import { useContext } from 'react';
import { Store } from '../../utils/Store';
import Layout from '../../components/Layout';
import ProductItem from '../../components/ProductItem';
import Notice from '../../components/Notice';
import Styles from './bookSingle.module.scss';
import db from '../../utils/db';
import Product from '../../models/Product';

export default function BookSingle(props) {
	const { state, dispatch } = useContext(Store);
	const { query } = useRouter();
	const { slug } = query;
	const book = props.products.find((book) => book.slug == slug);
	const addToCart = async () => {
		const bookInCart = state.cart.cartItems.find(
			(item) => item.slug === book.slug
		);
		const quantity = bookInCart ? bookInCart.quantity + 1 : 1;
		let data = await fetch(`/api/product/${book._id}`);
		data = await data.json();
		if (Number(data.book.countInStock) < Number(quantity)) {
			alert('Sorry, Product is out of stock now');
			return;
		}
		dispatch({
			type: 'CART_ADD_ITEM',
			payload: {
				...book,
				quantity,
			},
		});
	};

	// Get Top 4 related books based on category
	const topRelatedBooks = props.products
		.filter(
			(product) =>
				product.category === book?.category && product.slug != book.slug
		)
		.slice(0, 4);

	if (!book) {
		return (
			<Layout>
				<div className="container">
					<Notice>
						<p>Book can't be Found</p>
					</Notice>
				</div>
			</Layout>
		);
	}
	return (
		<Layout title={book.name}>
			<div className={Styles.book_single_wrap}>
				<div className="container">
					<div className={Styles.book_single_details}>
						<div className={Styles.book_image}>
							<img src={book.image} alt={book.name} />
						</div>
						<div className={Styles.book_single_content}>
							<h2>{book.name}</h2>
							<p className={Styles.book_author}>
								By {book.author}
							</p>
							<p className={Styles.book_meta}>
								<strong>Category: </strong>
								{book.category}
							</p>
							<p className={Styles.book_meta}>
								<strong>Review: </strong>
								{`${book.rating} of ${book.numReviews} reviews`}
							</p>
							<p className={Styles.book_description}>
								{book.description}
							</p>
							<div className={Styles.book_order_block}>
								<p className={Styles.book_meta}>
									<strong>Price: </strong>
									{`$${book.price}`}
								</p>
								<button
									onClick={() => addToCart()}
									className={`${Styles.book_button} button`}
									disabled={
										book.countInStock > 0 ? '' : 'disabled'
									}
								>
									{book.countInStock > 0
										? 'Add To Cart'
										: 'Out Of Stock'}
								</button>
							</div>
						</div>
					</div>

					{topRelatedBooks ? (
						<div className={Styles.related_books}>
							<h3 className="t-align-center">Related Books</h3>
							<div className="book_listing">
								{topRelatedBooks.map((product) => (
									<ProductItem
										product={product}
										key={product.slug}
									/>
								))}
							</div>
						</div>
					) : (
						''
					)}
				</div>
			</div>
		</Layout>
	);
}

export async function getServerSideProps() {
	await db.connect();
	const products = await Product.find().lean();

	return {
		props: {
			products: products.map(db.convertDoctoObj),
		},
	};
}
