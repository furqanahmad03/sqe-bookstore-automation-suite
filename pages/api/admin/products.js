import { getToken } from 'next-auth/jwt';
import Product from '../../../models/Product';
import db from '../../../utils/db';

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
		await db.connect();

		if (req.method === 'GET') {
			const products = await Product.find().lean();
			return res.status(200).json({ products });
		}

		if (req.method === 'POST') {
			const { name, author, description, category, price, quantity } = req.body;

			if (!name || !author || !description || !category || !price || quantity === undefined) {
				return res.status(400).json({ message: 'All fields are required' });
			}

			// Generate slug from name
			const slug = name
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/(^-|-$)/g, '');

			// Check if slug already exists
			const existingProduct = await Product.findOne({ slug });
			if (existingProduct) {
				return res.status(400).json({ message: 'Product with this name already exists' });
			}

			const newProduct = new Product({
				name,
				author,
				description,
				category,
				price: Number(price),
				quantity: Number(quantity),
				slug,
			});

			const product = await newProduct.save();
			return res.status(201).json({ product });
		}

		return res.status(400).json({ message: 'Method not allowed' });
	} catch (error) {
		console.error('API Error:', error);
		return res.status(500).json({ message: error.message || 'Internal server error' });
	}
};

export default handler;

