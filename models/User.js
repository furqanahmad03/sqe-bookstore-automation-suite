import mongoose from 'mongoose';

const Schema = new mongoose.Schema(
	{
		name: { type: String, require: true },
		email: { type: String, require: true, unique: true },
		password: { type: String, require: true },
		isAdmin: { type: Boolean, require: true, default: false },
	},
	{
		timestamps: true,
	}
);

const User = mongoose.models.User || mongoose.model('User', Schema);

export default User;
