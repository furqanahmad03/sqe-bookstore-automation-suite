import mongoose from 'mongoose';

const Schema = new mongoose.Schema(
	{
		name: { type: String, require: true },
		author: { type: String, require: true },
		description: { type: String, require: true },
		slug: { type: String, require: true, unique: true },
		category: { type: String, require: true },
		price: { type: Number, require: true },
		quantity: { type: Number, require: true, default: 0 },
	},
	{
		timestamps: true,
	}
);

const Product = mongoose.models.Product || mongoose.model('Product', Schema);

export default Product;
