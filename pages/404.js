import Link from 'next/link';
import Layout from '../components/Layout';

export default function noRouteFound() {
	return (
		<Layout>
			<div className="container t-align-center">
				<h2>404</h2>
				<p>
					No route found. Go to{' '}
					<Link href="/">
							<span style={{ textDecoration: 'underline' }}>
								Homepage
							</span>
					</Link>
				</p>
			</div>
		</Layout>
	);
}
