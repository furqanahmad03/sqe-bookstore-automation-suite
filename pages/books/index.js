"use client";

import Layout from '../../components/Layout';
import ProductItem from '../../components/ProductItem';
import Product from '../../models/Product';
import db from '../../utils/db';
import { useState } from 'react';

const Books = (props) => {
	const [searchText, setSearchText] = useState('');
	const filteredBooks = props.products.filter((product) =>
		product.name.toLowerCase().includes(searchText.toLowerCase())
	);


	return (
		<Layout title="Browse Books">
			<div className="searchbar-container">
				<div className="searchbar-wrapper">
					<input
					className="searchbar-input"
					type="text"
					placeholder="Search books"
					value={searchText}
					onChange={(e) => setSearchText(e.target.value)}
					/>
					<button
					className="searchbar-button"
					onClick={() => setSearchText("")}
					>
					Clear
					</button>
				</div>
				</div>
			<div className="container">
				<h2 className="t-align-center">Browse Books</h2>
				<div className="books_wrap">
					<div className="books_content">
						{filteredBooks ? (
							<div className="related_books">
								<div className="book_listing">
									{filteredBooks.map((product) => (
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
			</div>
		</Layout>
	);
};

export default Books;

export async function getServerSideProps() {
	try {
		await db.connect();
		const products = await Product.find().lean();

		return {
			props: {
				products: products.map(db.convertDoctoObj),
			},
		};
	} catch (error) {
		console.error('Error fetching products:', error);
		return {
			props: {
				products: [],
			},
		};
	}
}
