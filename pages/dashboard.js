import { useState, useEffect, useReducer } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Layout from '../components/Layout';
import TableStyles from './table.module.scss';
import Styles from './form.module.scss';
import DashboardStyles from './dashboard.module.scss';
import { useNotification } from '../components/NotificationProvider';
import ConfirmModal from '../components/ConfirmModal';

function reducer(state, action) {
	switch (action.type) {
		case 'FETCH_REQUEST':
			return { ...state, loading: true, error: '' };
		case 'FETCH_SUCCESS':
			return {
				...state,
				loading: false,
				products: action.payload,
				error: '',
			};
		case 'FETCH_FAIL':
			return { ...state, loading: false, error: action.payload };
		case 'FETCH_ORDERS_REQUEST':
			return { ...state, ordersLoading: true, ordersError: '' };
		case 'FETCH_ORDERS_SUCCESS':
			return {
				...state,
				ordersLoading: false,
				orders: action.payload,
				ordersError: '',
			};
		case 'FETCH_ORDERS_FAIL':
			return { ...state, ordersLoading: false, ordersError: action.payload };
		default:
			return state;
	}
}

export default function Dashboard() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const { showSuccess, showError, showWarning } = useNotification();
	const [activeTab, setActiveTab] = useState('books');
	const [editingProduct, setEditingProduct] = useState(null);
	const [showForm, setShowForm] = useState(false);
	const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, bookId: null, bookName: '' });
	const [formData, setFormData] = useState({
		name: '',
		author: '',
		description: '',
		category: '',
		price: '',
		quantity: '',
	});

	const [{ loading, error, products, ordersLoading, orders, ordersError }, dispatch] = useReducer(reducer, {
		loading: true,
		products: [],
		error: '',
		ordersLoading: true,
		orders: [],
		ordersError: '',
	});

	useEffect(() => {
		if (status === 'loading') return;
		if (!session || !session.user.isAdmin) {
			router.push('/unauthorized?message=Admin access required');
			return;
		}
		fetchProducts();
		fetchOrders();
	}, [session, status, router]);

	const fetchProducts = async () => {
		try {
			dispatch({ type: 'FETCH_REQUEST' });
			const { data } = await axios.get('/api/admin/products');
			dispatch({ type: 'FETCH_SUCCESS', payload: data.products });
		} catch (err) {
			dispatch({ type: 'FETCH_FAIL', payload: err.message });
		}
	};

	const fetchOrders = async () => {
		try {
			dispatch({ type: 'FETCH_ORDERS_REQUEST' });
			const { data } = await axios.get('/api/admin/orders');
			dispatch({ type: 'FETCH_ORDERS_SUCCESS', payload: data.orders });
		} catch (err) {
			dispatch({ type: 'FETCH_ORDERS_FAIL', payload: err.message });
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (editingProduct) {
				await axios.put(`/api/admin/products/${editingProduct._id}`, formData);
				showSuccess('Book updated successfully!');
			} else {
				await axios.post('/api/admin/products', formData);
				showSuccess('Book created successfully!');
			}
			setShowForm(false);
			setEditingProduct(null);
			setFormData({
				name: '',
				author: '',
				description: '',
				category: '',
				price: '',
				quantity: '',
			});
			fetchProducts();
		} catch (err) {
			showError(err.response?.data?.message || err.message || 'An error occurred');
		}
	};

	const handleEdit = (product) => {
		setEditingProduct(product);
		setFormData({
			name: product.name,
			author: product.author,
			description: product.description,
			category: product.category,
			price: product.price,
			quantity: product.quantity,
		});
		setShowForm(true);
	};

	const handleDeleteClick = (id, name) => {
		setDeleteConfirm({ isOpen: true, bookId: id, bookName: name });
	};

	const handleDeleteConfirm = async () => {
		if (!deleteConfirm.bookId) return;
		
		try {
			await axios.delete(`/api/admin/products/${deleteConfirm.bookId}`);
			showSuccess('Book deleted successfully!');
			setDeleteConfirm({ isOpen: false, bookId: null, bookName: '' });
			fetchProducts();
		} catch (err) {
			showError(err.response?.data?.message || err.message || 'Failed to delete book');
			setDeleteConfirm({ isOpen: false, bookId: null, bookName: '' });
		}
	};

	const handleDeleteCancel = () => {
		setDeleteConfirm({ isOpen: false, bookId: null, bookName: '' });
	};

	const handleCancel = () => {
		setShowForm(false);
		setEditingProduct(null);
		setFormData({
			name: '',
			author: '',
			description: '',
			category: '',
			price: '',
			quantity: '',
		});
	};

	if (status === 'loading') {
		return (
			<Layout>
				<div className="container">Loading...</div>
			</Layout>
		);
	}

	if (!session || !session.user.isAdmin) {
		return null;
	}

	return (
		<Layout title="Admin Dashboard">
			<div className={`container ${DashboardStyles.dashboard}`}>
				<div className={DashboardStyles.header}>
					<h2>Admin Dashboard</h2>
				</div>

				<div className={DashboardStyles.tabs}>
					<button
						onClick={() => setActiveTab('books')}
						className={`${DashboardStyles.tab} ${activeTab === 'books' ? DashboardStyles.active : ''}`}
					>
						Books
					</button>
					<button
						onClick={() => setActiveTab('orders')}
						className={`${DashboardStyles.tab} ${activeTab === 'orders' ? DashboardStyles.active : ''}`}
					>
						Orders
					</button>
				</div>

				{activeTab === 'books' && (
					<div>
						<div className={DashboardStyles.section_header}>
							<h3>Books Management</h3>
							{!showForm && (
								<button
									onClick={() => setShowForm(true)}
									className={DashboardStyles.add_button}
								>
									+ Add New Book
								</button>
							)}
						</div>

						{showForm && (
							<div className={DashboardStyles.form_card}>
								<h3>{editingProduct ? 'Edit Book' : 'Add New Book'}</h3>
								<form onSubmit={handleSubmit} className={Styles.form}>
									<div className={DashboardStyles.form_group}>
										<label>Name</label>
										<input
											type="text"
											value={formData.name}
											onChange={(e) => setFormData({ ...formData, name: e.target.value })}
											required
											placeholder="Enter book name"
										/>
									</div>
									<div className={DashboardStyles.form_group}>
										<label>Author</label>
										<input
											type="text"
											value={formData.author}
											onChange={(e) => setFormData({ ...formData, author: e.target.value })}
											required
											placeholder="Enter author name"
										/>
									</div>
									<div className={DashboardStyles.form_group}>
										<label>Description</label>
										<textarea
											value={formData.description}
											onChange={(e) => setFormData({ ...formData, description: e.target.value })}
											required
											rows="4"
											placeholder="Enter book description"
										/>
									</div>
									<div className={DashboardStyles.form_group}>
										<label>Category</label>
										<input
											type="text"
											value={formData.category}
											onChange={(e) => setFormData({ ...formData, category: e.target.value })}
											required
											placeholder="Enter category"
										/>
									</div>
									<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
										<div className={DashboardStyles.form_group}>
											<label>Price ($)</label>
											<input
												type="number"
												step="0.01"
												value={formData.price}
												onChange={(e) => setFormData({ ...formData, price: e.target.value })}
												required
												placeholder="0.00"
											/>
										</div>
										<div className={DashboardStyles.form_group}>
											<label>Quantity</label>
											<input
												type="number"
												value={formData.quantity}
												onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
												required
												placeholder="0"
											/>
										</div>
									</div>
									<div className={DashboardStyles.form_actions}>
										<button type="submit" className="button">
											{editingProduct ? 'Update Book' : 'Create Book'}
										</button>
										<button type="button" onClick={handleCancel} className={`button ${DashboardStyles.cancel_button}`}>
											Cancel
										</button>
									</div>
								</form>
							</div>
						)}

						{loading ? (
							<div className={DashboardStyles.loading}>Loading books...</div>
						) : error ? (
							<div className={DashboardStyles.error}>{error}</div>
						) : products.length === 0 ? (
							<div className={DashboardStyles.empty_state}>
								<p>No books found. Add your first book to get started!</p>
							</div>
						) : (
							<div className={TableStyles.table_wrap}>
								<table className={TableStyles.table}>
									<thead>
										<tr>
											<th>Name</th>
											<th>Author</th>
											<th>Category</th>
											<th>Price</th>
											<th>Quantity</th>
											<th>Actions</th>
										</tr>
									</thead>
									<tbody>
										{products.map((product) => (
											<tr key={product._id}>
												<td><strong>{product.name}</strong></td>
												<td>{product.author}</td>
												<td>{product.category}</td>
												<td>${product.price}</td>
												<td>{product.quantity}</td>
												<td>
													<div className={DashboardStyles.action_buttons}>
														<button
															onClick={() => handleEdit(product)}
															className={DashboardStyles.edit_button}
														>
															Edit
														</button>
														<button
															onClick={() => handleDeleteClick(product._id, product.name)}
															className={DashboardStyles.delete_button}
														>
															Delete
														</button>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</div>
				)}

				{activeTab === 'orders' && (
					<div>
						<div className={DashboardStyles.section_header}>
							<h3>Orders Management</h3>
						</div>

						{ordersLoading ? (
							<div className={DashboardStyles.loading}>Loading orders...</div>
						) : ordersError ? (
							<div className={DashboardStyles.error}>{ordersError}</div>
						) : orders.length === 0 ? (
							<div className={DashboardStyles.empty_state}>
								<p>No orders found yet.</p>
							</div>
						) : (
							<>
								<div className={DashboardStyles.stats_grid}>
									<div className={DashboardStyles.stat_card}>
										<div className={DashboardStyles.stat_label}>Total Orders</div>
										<div className={DashboardStyles.stat_value}>{orders.length}</div>
									</div>
									<div className={DashboardStyles.stat_card}>
										<div className={DashboardStyles.stat_label}>Total Revenue</div>
										<div className={DashboardStyles.stat_value}>
											${orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0).toFixed(2)}
										</div>
									</div>
									<div className={DashboardStyles.stat_card}>
										<div className={DashboardStyles.stat_label}>Paid Orders</div>
										<div className={DashboardStyles.stat_value}>
											{orders.filter(order => order.isPaid).length}
										</div>
									</div>
									<div className={DashboardStyles.stat_card}>
										<div className={DashboardStyles.stat_label}>Delivered Orders</div>
										<div className={DashboardStyles.stat_value}>
											{orders.filter(order => order.isDelivered).length}
										</div>
									</div>
								</div>
								<div className={TableStyles.table_wrap}>
									<table className={TableStyles.table}>
										<thead>
											<tr>
												<th>Order ID</th>
												<th>User</th>
												<th>Date</th>
												<th>Total</th>
												<th>Paid</th>
												<th>Delivered</th>
												<th>Action</th>
											</tr>
										</thead>
										<tbody>
											{orders.map((order) => (
												<tr key={order._id}>
													<td><code>{order._id.substring(20, 24)}</code></td>
													<td>{order.user?.name || order.user?.email || 'N/A'}</td>
													<td>{order.createdAt?.substring(0, 10)}</td>
													<td><strong>${order.totalPrice}</strong></td>
													<td>
														{order.isPaid ? (
															<span style={{ color: '#28a745' }}>✓ {order.paidAt?.substring(0, 10)}</span>
														) : (
															<span style={{ color: '#dc3545' }}>✗ Not paid</span>
														)}
													</td>
													<td>
														{order.isDelivered ? (
															<span style={{ color: '#28a745' }}>✓ {order.deliveredAt?.substring(0, 10)}</span>
														) : (
															<span style={{ color: '#dc3545' }}>✗ Not delivered</span>
														)}
													</td>
													<td>
														<a href={`/order/${order._id}`} className={DashboardStyles.view_link}>
															View Details
														</a>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</>
						)}
					</div>
				)}
			</div>

			<ConfirmModal
				isOpen={deleteConfirm.isOpen}
				onClose={handleDeleteCancel}
				onConfirm={handleDeleteConfirm}
				title="Delete Book"
				message={`Are you sure you want to delete "${deleteConfirm.bookName}"? This action cannot be undone.`}
			/>
		</Layout>
	);
}

Dashboard.auth = true;

