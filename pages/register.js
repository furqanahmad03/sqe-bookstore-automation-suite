import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';

import Layout from '../components/Layout';
import Styles from './form.module.scss';

const Register = () => {
	const { data: session } = useSession();
	const router = useRouter();
	const { redirect } = router.query;

	const [customError, setCustomError] = useState(null);

	useEffect(() => {
		if (session?.user) {
			router.push(redirect || '/');
		}
	}, [session, router]);

	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm();

	const submitHandler = async ({
		name,
		email,
		password,
		confirm_password,
	}) => {
		if (password !== confirm_password) {
			return;
		}

		try {
			const addUSer = await fetch('/api/auth/signup', {
				method: 'POST',
				credentials: 'same-origin',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name,
					email,
					password,
				}),
			});

			const response = await addUSer.json();
			if (!addUSer.ok) {
				setCustomError(response.message);
			} else {
				const result = await signIn('credentials', {
					redirect: false,
					email,
					password,
				});
			}
		} catch (err) {
			setCustomError(err.message);
		}
	};

	return (
		<Layout title="Register">
			<div className="container">
				<form
					className={Styles.form}
					onSubmit={handleSubmit(submitHandler)}
				>
					<h2>Register</h2>

					<label htmlFor="name">Name</label>
					<input
						type="text"
						placeholder="Enter your Name"
						id="name"
						autoFocus
						{...register('name', {
							required: 'Please provide your name',
							minLength: {
								value: 3,
								message:
									'Name should be minimum 3 characters long',
							},
						})}
					/>
					{errors.name && (
						<span className={Styles.error} role="alert">
							{errors.name.message}
						</span>
					)}

					<label htmlFor="email">Email</label>
					<input
						type="text"
						placeholder="Enter your Email"
						id="email"
						{...register('email', {
							required: 'Please provide your email address',
							pattern: {
								value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i,
								message: 'Please enter valid email address',
							},
						})}
					/>
					{errors.email && (
						<span className={Styles.error} role="alert">
							{errors.email.message}
						</span>
					)}

					{customError ? (
						<p>
							<span className={Styles.error} role="alert">
								{customError}
							</span>
						</p>
					) : null}

					<label htmlFor="password">Password</label>
					<input
						type="password"
						placeholder="Enter your Password"
						id="password"
						{...register('password', {
							required: 'Please provide your password',
							minLength: {
								value: 6,
								message:
									"Password can't be less than 6 characters",
							},
						})}
					/>
					{errors.password && (
						<span className={Styles.error} role="alert">
							{errors.password.message}
						</span>
					)}

					<label htmlFor="confirm_password">Confirm Password</label>
					<input
						type="password"
						placeholder="Enter your Password"
						id="confirm_password"
						{...register('confirm_password', {
							required: 'Please confirm your password',
							minLength: {
								value: 6,
								message:
									"Password can't be less than 6 characters",
							},
						})}
					/>
					{errors.confirm_password && (
						<span className={Styles.error} role="alert">
							{errors.confirm_password.message}
						</span>
					)}

					{watch('password') !== watch('confirm_password') &&
					!errors.confirm_password ? (
						<span className={Styles.error} role="alert">
							Password Does not match
						</span>
					) : null}

					<button type="submit" className="button">
						Login
					</button>

					<p>
						Already have an account?{' '}
						<Link href="/login" legacyBehavior>
							<a>Login</a>
						</Link>
					</p>
				</form>
			</div>
		</Layout>
	);
};

export default Register;
