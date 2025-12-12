import { getToken } from 'next-auth/jwt';
import Product from '../../../../models/Product';
import db from '../../../../utils/db';

const secret = process.env.NEXTAUTH_SECRET || 'development-secret-key';

const handler = async (req, res) => {
	const token = await getToken({ req, secret });
	
	if (!token) {
		return res.status(401).json({ message: 'Authentication required' });
	}

	if (!token.isAdmin) {
		return res.status(403).json({ message: 'Admin access required' });
	}

	try {
		const { id } = req.query;
		await db.connect();

		if (req.method === 'GET') {
			const product = await Product.findById(id);
			if (!product) {
				return res.status(404).json({ message: 'Product not found' });
			}
			return res.status(200).json({ product });
		}

		if (req.method === 'PUT') {
			const { name, author, description, category, price, quantity } = req.body;

			if (!name || !author || !description || !category || !price || quantity === undefined) {
				return res.status(400).json({ message: 'All fields are required' });
			}

			const product = await Product.findById(id);
			if (!product) {
				return res.status(404).json({ message: 'Product not found' });
			}

			// Generate slug from name
			const slug = name
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/(^-|-$)/g, '');

			// Check if slug already exists for a different product
			const existingProduct = await Product.findOne({ slug, _id: { $ne: id } });
			if (existingProduct) {
				return res.status(400).json({ message: 'Product with this name already exists' });
			}

			product.name = name;
			product.author = author;
			product.description = description;
			product.category = category;
			product.price = Number(price);
			product.quantity = Number(quantity);
			product.slug = slug;

			const updatedProduct = await product.save();
			return res.status(200).json({ product: updatedProduct });
		}

		if (req.method === 'DELETE') {
			const product = await Product.findById(id);
			if (!product) {
				return res.status(404).json({ message: 'Product not found' });
			}

			await Product.findByIdAndDelete(id);
			return res.status(200).json({ message: 'Product deleted successfully' });
		}

		return res.status(400).json({ message: 'Method not allowed' });
	} catch (error) {
		console.error('API Error:', error);
		return res.status(500).json({ message: error.message || 'Internal server error' });
	}
};

export default handler;

