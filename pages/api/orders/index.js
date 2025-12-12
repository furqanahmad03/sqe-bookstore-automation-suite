import { getToken } from 'next-auth/jwt';
import Order from '../../../models/Order';
import db from '../../../utils/db';

const secret = process.env.NEXTAUTH_SECRET || 'development-secret-key';

const handler = async (req, res) => {
	if (req.method !== 'POST') {
		return res.status(400).json({ message: 'Method not allowed' });
	}

	const token = await getToken({ req, secret });
	if (!token) {
		return res.status(401).json({ message: 'Authentication required' });
	}

	try {
		await db.connect();
		const newOrder = new Order({
			...req.body,
			user: token.id,
		});

		const order = await newOrder.save();
		await db.disconnect();
		res.status(201).json(order);
	} catch (error) {
		await db.disconnect();
		console.error('Order creation error:', error);
		res.status(500).json({ message: error.message || 'Failed to create order' });
	}
};

export default handler;
