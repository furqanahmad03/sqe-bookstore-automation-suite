import Head from 'next/head';
import Link from 'next/link';
import Header from './Header';

export default function Layout({ title, children }) {
	return (
		<>
			<Head>
				<title>{title ? title + ' | Book Store' : 'Book Store'}</title>
				<meta
					name="description"
					content="Book Store E-Commerce We site built with Nextjs"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<div className="main-wrapper">
				<Header />
				<main className="main">{children}</main>
				<footer className="footer">
					<div className="container">
						Built with Nextjs and MongoDB by{' '}
						<Link href="https://furqanahmad.me/" legacyBehavior>
							<a target="_blank">Furqan Ahmad</a>
						</Link>
					</div>
				</footer>
			</div>
		</>
	);
}
