import Link from 'next/link';

// styles
import Styles from './Banner.module.css';

const Banner = () => {
	return (
		<div className={Styles.banner}>
			<div className="container">
				<div className={Styles.banner_inner}>
					<h2 className="fadeInLeft">Find your next book</h2>
					<p className="description fadeInLeft">
						Browse through the list of awesome books
					</p>
					<Link href="/books" legacyBehavior>
						<a className={`${Styles.button} button fadeInLeft`}>
							Find Books
						</a>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Banner;
