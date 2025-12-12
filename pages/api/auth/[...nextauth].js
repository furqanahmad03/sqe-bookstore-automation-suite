import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcryptjs from 'bcryptjs';
import User from '../../../models/User';
import db from '../../../utils/db';

const secret = process.env.NEXTAUTH_SECRET || 'development-secret-key';

export const authOptions = {
	session: {
		strategy: 'jwt',
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.isAdmin = user.isAdmin;
			}
			return token;
		},
		async session({ session, token }) {
			if (token) {
				session.user.id = token.id;
				session.user.isAdmin = token.isAdmin;
			}
			return session;
		},
	},
	providers: [
		CredentialsProvider({
			async authorize(credentials) {
				await db.connect();
				const user = await User.findOne({ email: credentials.email });
				await db.disconnect();

				if (user && bcryptjs.compareSync(credentials.password, user.password)) {
					return {
						id: user._id.toString(),
						name: user.name,
						email: user.email,
						isAdmin: user.isAdmin || false,
					};
				}
				return null;
			},
		}),
	],
	secret,
};

export default NextAuth(authOptions);
