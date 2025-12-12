import { getToken } from 'next-auth/jwt';
import Order from '../../../models/Order';
import db from '../../../utils/db';

const secret = process.env.NEXTAUTH_SECRET || 'development-secret-key';

const handler = async (req, res) => {
	if (req.method !== 'GET') {
		return res.status(400).json({ message: 'Method not allowed' });
	}

	const token = await getToken({ req, secret });
	if (!token) {
		return res.status(401).json({ message: 'Authentication required' });
	}

	try {
		await db.connect();
		const orders = await Order.find({ user: token.id });
		await db.disconnect();
		res.json(orders);
	} catch (error) {
		await db.disconnect();
		console.error('Error fetching orders:', error);
		res.status(500).json({ message: error.message || 'Failed to fetch orders' });
	}
};

export default handler;
