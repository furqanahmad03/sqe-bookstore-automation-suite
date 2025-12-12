import Product from '../../../models/Product';
import db from '../../../utils/db';

const handler = async (req, res) => {
	const id = req.query.id;
	await db.connect();
	let book;

	try {
		book = await Product.findById(id);
	} catch (err) {
		return res.status(404).json({ message: 'No Book Found' });
	}

	if (!book) {
		return res.status(404).json({ message: 'No Book Found' });
	}

	return res.status(200).json({ book });
};

export default handler;
