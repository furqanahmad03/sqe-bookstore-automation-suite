import { getToken } from 'next-auth/jwt';
import bcryptjs from 'bcryptjs';
import User from '../../../models/User';
import db from '../../../utils/db';

const secret = process.env.NEXTAUTH_SECRET || 'development-secret-key';

async function handler(req, res) {
	if (req.method !== 'POST') {
		return res.status(400).json({ message: `${req.method} not supported` });
	}

	const token = await getToken({ req, secret });
	if (!token) {
		return res.status(401).json({ message: 'Authentication required' });
	}

	const { name, email, password } = req.body;

	if (
		!name ||
		!email ||
		!email.includes('@') ||
		(password && password.trim().length < 5)
	) {
		res.status(422).json({
			message: 'Validation error',
		});
		return;
	}

	try {
		await db.connect();
		const toUpdateUser = await User.findById(token.id);
		
		if (!toUpdateUser) {
			await db.disconnect();
			return res.status(404).json({ message: 'User not found' });
		}

		toUpdateUser.name = name;
		toUpdateUser.email = email;

		if (password) {
			toUpdateUser.password = bcryptjs.hashSync(password);
		}

		await toUpdateUser.save();
		await db.disconnect();
		res.json({ message: 'User updated' });
	} catch (error) {
		await db.disconnect();
		console.error('Update error:', error);
		res.status(500).json({ message: error.message || 'Failed to update user' });
	}
}

export default handler;
