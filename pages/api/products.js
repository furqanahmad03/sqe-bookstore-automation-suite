import Product from '../../models/Product';
import db from '../../utils/db';

const handler = async (req, res) => {
	await db.connect();
	let books;

	try {
		books = await Product.find().lean();
	} catch (err) {
		return new Error(err);
	}

	if (!books) {
		return res.status(500).json({ message: 'Internal server error' });
	}

	if (books.length === 0) {
		return res.status(404).json({ message: 'No Books found' });
	}

	return res.status(200).json({ books });
};

export default handler;
