import { getToken } from 'next-auth/jwt';
import Order from '../../../models/Order';
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
			const orders = await Order.find().populate('user', 'name email').lean().sort({ createdAt: -1 });
			return res.status(200).json({ orders });
		}

		return res.status(400).json({ message: 'Method not allowed' });
	} catch (error) {
		console.error('API Error:', error);
		return res.status(500).json({ message: error.message || 'Internal server error' });
	}
};

export default handler;

