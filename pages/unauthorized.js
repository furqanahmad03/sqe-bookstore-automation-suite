import { useRouter } from 'next/router';
import React from 'react';

import Layout from '../components/Layout';
import Notice from '../components/Notice';

const Unauthorized = () => {
	const router = useRouter();
	const { message } = router.query;

	return (
		<Layout title="Unauthorized Page">
			<div className="container t-align-center">
				<h2>Access Denied</h2>
				{message && <Notice>{message}</Notice>}
			</div>
		</Layout>
	);
};

export default Unauthorized;
