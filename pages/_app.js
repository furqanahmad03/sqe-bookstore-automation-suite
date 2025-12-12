import '../styles/globals.scss';
import { SessionProvider, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { StoreProvider } from '../utils/Store';
import { NotificationProvider } from '../components/NotificationProvider';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
	return (
		<SessionProvider session={session} refetchInterval={5 * 60}>
			<StoreProvider>
				<NotificationProvider>
					{Component.auth ? (
						<Auth>
							<Component {...pageProps} />
						</Auth>
					) : (
						<Component {...pageProps} />
					)}
				</NotificationProvider>
			</StoreProvider>
		</SessionProvider>
	);
}

function Auth({ children }) {
	const router = useRouter();
	const { status } = useSession({
		required: true,
		onUnauthenticated() {
			router.push('/unauthorized?message=login required');
		},
	});
	if (status === 'loading') {
		return <div>Loading...</div>;
	}

	return children;
}

export default MyApp;
