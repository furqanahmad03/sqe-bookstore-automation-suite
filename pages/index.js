import Layout from '../components/Layout';
import Banner from '../components/Banner';
import ProductItem from '../components/ProductItem';
import db from '../utils/db';
import Product from '../models/Product';

export default function Home(props) {
	// Get Top 4 Featured books
	const featuredBooks = props.products.slice(0, 4);
	return (
		<Layout title="Homepage">
			<Banner />
			<div className="book_listing_wrap">
				<div className="container">
					<h2 className="t-align-center">Featured Books</h2>
					<div className="book_listing">
						{featuredBooks.map((product) => (
							<ProductItem product={product} key={product.slug} />
						))}
					</div>
				</div>
			</div>
		</Layout>
	);
}

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
