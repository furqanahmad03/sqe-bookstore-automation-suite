import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';

import { Store } from '../utils/Store';
import { DropdownMenu, MenuButton, Menu, MenuItem } from './DropdownMenu';

// Styling
import Styles from './Header.module.scss';

export default function Header() {
	const { status, data: session } = useSession();
	const { pathname } = useRouter();
	const { state } = useContext(Store);
	const [cartNumber, SetCartNumber] = useState(0);

	useEffect(() => {
		SetCartNumber(
			state.cart.cartItems.reduce((acc, item) => acc + item.quantity, 0)
		);
	}, [state.cart.cartItems]);

	return (
		<header className={Styles.header}>
			<div className="container">
				<div className={Styles.header_inner}>
					<h1>
						<Link href="/">
								Book <span>Store</span>
						</Link>
					</h1>
					<div className="header_sidebar">
						<nav aria-label="main menu" role="navigation">
							<ul>
								<li
									className={
										pathname.split('/')[1] === 'cart'
											? Styles.active
											: ''
									}
								>
									<Link href="/cart">
											{/* Add "Styles.active" to show active state */}
											<span>Cart</span>{' '}
											<span className={Styles.cart_item} data-testid="cart-count">
												{cartNumber}
											</span>
									</Link>
								</li>
								<li
									className={
										pathname.split('/')[1] === 'login'
											? Styles.active
											: ''
									}
								>
									{status == 'loading' ? (
										<span>Loading</span>
									) : session?.user ? (
										<DropdownMenu className="dropdown">
											<MenuButton
												className={Styles.nav_button}
											>
												<span aria-hidden>
													{session.user.name}
												</span>
											</MenuButton>
											<Menu>
												<MenuItem>
													<Link href="/profile">
														Profile
													</Link>
												</MenuItem>
												{session.user.isAdmin ? (
													<MenuItem>
														<Link href="/dashboard">
															Dashboard
														</Link>
													</MenuItem>
												) : (
													<MenuItem>
														<Link href="/order-history">
															Orders
														</Link>
													</MenuItem>
												)}
												<MenuItem>
													<button
														onClick={() =>
															signOut({
																callbackUrl:
																	'/',
															})
														}
													>
														Logout
													</button>
												</MenuItem>
											</Menu>
										</DropdownMenu>
									) : (
										<Link href="/login">
											Login
										</Link>
									)}
								</li>
							</ul>
						</nav>
					</div>
				</div>
			</div>
		</header>
	);
}
