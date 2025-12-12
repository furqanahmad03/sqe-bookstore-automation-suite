import { getToken } from 'next-auth/jwt';
import db from '../../../utils/db';
import Order from '../../../models/Order';

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
		const order = await Order.findById(req.query.id);
		await db.disconnect();
		
		if (!order) {
			return res.status(404).json({ message: 'Order not found' });
		}
		
		res.json(order);
	} catch (error) {
		await db.disconnect();
		console.error('Error fetching order:', error);
		res.status(500).json({ message: error.message || 'Failed to fetch order' });
	}
};

export default handler;
