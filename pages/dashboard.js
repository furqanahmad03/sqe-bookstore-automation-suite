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
      return { ...state, loading: false, products: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'FETCH_ORDERS_REQUEST':
      return { ...state, ordersLoading: true, ordersError: '' };
    case 'FETCH_ORDERS_SUCCESS':
      return { ...state, ordersLoading: false, orders: action.payload, ordersError: '' };
    case 'FETCH_ORDERS_FAIL':
      return { ...state, ordersLoading: false, ordersError: action.payload };
    default:
      return state;
  }
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { showSuccess, showError } = useNotification();

  const [activeTab, setActiveTab] = useState('books');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, bookId: null, bookName: '' });

  const [formData, setFormData] = useState({
    name: '', author: '', description: '', category: '', price: '', quantity: ''
  });

  const [{ loading, error, products, ordersLoading, orders, ordersError }, dispatch] = useReducer(reducer, {
    loading: true, products: [], error: '',
    ordersLoading: true, orders: [], ordersError: ''
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session?.user?.isAdmin) {
      router.push('/unauthorized?message=Admin access required');
      return;
    }
    fetchProducts();
    fetchOrders();
  }, [session, status]);

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
      setFormData({ name: '', author: '', description: '', category: '', price: '', quantity: '' });
      fetchProducts();
    } catch (err) {
      showError(err.response?.data?.message || err.message || 'An error occurred');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({ ...product });
    setShowForm(true);
  };

  const handleDeleteClick = (id, name) => setDeleteConfirm({ isOpen: true, bookId: id, bookName: name });
  const handleDeleteCancel = () => setDeleteConfirm({ isOpen: false, bookId: null, bookName: '' });
  const handleCancel = () => { setShowForm(false); setEditingProduct(null); setFormData({ name: '', author: '', description: '', category: '', price: '', quantity: '' }); };

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

  if (status === 'loading') return <Layout><div className="container" data-testid="loading-container">Loading...</div></Layout>;
  if (!session?.user?.isAdmin) return null;

  return (
    <Layout title="Admin Dashboard">
      <div className={`container ${DashboardStyles.dashboard}`} data-testid="dashboard-container">
        <div className={DashboardStyles.header}><h2 data-testid="dashboard-title">Admin Dashboard</h2></div>

        <div className={DashboardStyles.tabs} data-testid="dashboard-tabs">
          <button onClick={() => setActiveTab('books')} className={`${DashboardStyles.tab} ${activeTab === 'books' ? DashboardStyles.active : ''}`} data-testid="books-tab" data-active={activeTab === 'books'}>Books</button>
          <button onClick={() => setActiveTab('orders')} className={`${DashboardStyles.tab} ${activeTab === 'orders' ? DashboardStyles.active : ''}`} data-testid="orders-tab" data-active={activeTab === 'orders'}>Orders</button>
        </div>

        {activeTab === 'books' && (
          <div data-testid="books-section">
            <div className={DashboardStyles.section_header}>
              <h3 data-testid="books-section-title">Books Management</h3>
              {!showForm && <button onClick={() => setShowForm(true)} className={DashboardStyles.add_button} data-testid="add-book-button">+ Add New Book</button>}
            </div>

            {showForm && (
              <div className={DashboardStyles.form_card} data-testid="book-form-card">
                <h3 data-testid="form-title">{editingProduct ? 'Edit Book' : 'Add New Book'}</h3>
                <form onSubmit={handleSubmit} className={Styles.form} data-testid="book-form">
                  <div className={DashboardStyles.form_group}>
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required placeholder="Enter book name" data-testid="book-name-input"/>
                  </div>
                  <div className={DashboardStyles.form_group}>
                    <label htmlFor="author">Author</label>
                    <input type="text" id="author" value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} required placeholder="Enter author name" data-testid="book-author-input"/>
                  </div>
                  <div className={DashboardStyles.form_group}>
                    <label htmlFor="description">Description</label>
                    <textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required rows="4" placeholder="Enter book description" data-testid="book-description-input"/>
                  </div>
                  <div className={DashboardStyles.form_group}>
                    <label htmlFor="category">Category</label>
                    <input type="text" id="category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required placeholder="Enter category" data-testid="book-category-input"/>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className={DashboardStyles.form_group}>
                      <label htmlFor="price">Price ($)</label>
                      <input type="number" id="price" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required placeholder="0.00" data-testid="book-price-input"/>
                    </div>
                    <div className={DashboardStyles.form_group}>
                      <label htmlFor="quantity">Quantity</label>
                      <input type="number" id="quantity" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} required placeholder="0" data-testid="book-quantity-input"/>
                    </div>
                  </div>
                  <div className={DashboardStyles.form_actions}>
                    <button type="submit" className="button" data-testid="submit-book-button">{editingProduct ? 'Update Book' : 'Create Book'}</button>
                    <button type="button" onClick={handleCancel} className={`button ${DashboardStyles.cancel_button}`} data-testid="cancel-book-button">Cancel</button>
                  </div>
                </form>
              </div>
            )}

            {loading ? <div className={DashboardStyles.loading} data-testid="books-loading">Loading books...</div> :
             error ? <div className={DashboardStyles.error} data-testid="books-error">{error}</div> :
             products.length === 0 ? <div className={DashboardStyles.empty_state} data-testid="books-empty-state"><p>No books found. Add your first book!</p></div> :
             <div className={TableStyles.table_wrap}>
               <table className={TableStyles.table} data-testid="books-table">
                 <thead><tr><th>Name</th><th>Author</th><th>Category</th><th>Price</th><th>Quantity</th><th>Actions</th></tr></thead>
                 <tbody>
                   {products.map((product, index) => (
                     <tr key={product._id} data-testid={`book-row-${index}`} data-book-id={product._id}>
                       <td data-testid={`book-name-${index}`}><strong>{product.name}</strong></td>
                       <td data-testid={`book-author-${index}`}>{product.author}</td>
                       <td data-testid={`book-category-${index}`}>{product.category}</td>
                       <td data-testid={`book-price-${index}`}>${product.price}</td>
                       <td data-testid={`book-quantity-${index}`}>{product.quantity}</td>
                       <td>
                         <div className={DashboardStyles.action_buttons}>
                           <button onClick={() => handleEdit(product)} className={DashboardStyles.edit_button} data-testid={`edit-book-${index}`}>Edit</button>
                           <button onClick={() => handleDeleteClick(product._id, product.name)} className={DashboardStyles.delete_button} data-testid={`delete-book-${index}`}>Delete</button>
                         </div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>}
          </div>
        )}

        {activeTab === 'orders' && (
          <div data-testid="orders-section">
            <div className={DashboardStyles.section_header}><h3 data-testid="orders-section-title">Orders Management</h3></div>
            {ordersLoading ? <div className={DashboardStyles.loading} data-testid="orders-loading">Loading orders...</div> :
             ordersError ? <div className={DashboardStyles.error} data-testid="orders-error">{ordersError}</div> :
             orders.length === 0 ? <div className={DashboardStyles.empty_state} data-testid="orders-empty-state"><p>No orders found yet.</p></div> :
             <>
               <div className={DashboardStyles.stats_grid} data-testid="order-stats">
                 <div className={DashboardStyles.stat_card} data-testid="stat-total-orders"><div className={DashboardStyles.stat_label}>Total Orders</div><div className={DashboardStyles.stat_value} data-testid="stat-total-orders-value">{orders.length}</div></div>
                 <div className={DashboardStyles.stat_card} data-testid="stat-total-revenue"><div className={DashboardStyles.stat_label}>Total Revenue</div><div className={DashboardStyles.stat_value} data-testid="stat-total-revenue-value">${orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0).toFixed(2)}</div></div>
                 <div className={DashboardStyles.stat_card} data-testid="stat-paid-orders"><div className={DashboardStyles.stat_label}>Paid Orders</div><div className={DashboardStyles.stat_value} data-testid="stat-paid-orders-value">{orders.filter(o => o.isPaid).length}</div></div>
                 <div className={DashboardStyles.stat_card} data-testid="stat-delivered-orders"><div className={DashboardStyles.stat_label}>Delivered Orders</div><div className={DashboardStyles.stat_value} data-testid="stat-delivered-orders-value">{orders.filter(o => o.isDelivered).length}</div></div>
               </div>
               <div className={TableStyles.table_wrap}>
                 <table className={TableStyles.table} data-testid="orders-table">
                   <thead><tr><th>Order ID</th><th>User</th><th>Date</th><th>Total</th><th>Paid</th><th>Delivered</th><th>Action</th></tr></thead>
                   <tbody>
                     {orders.map((order, index) => (
                       <tr key={order._id} data-testid={`order-row-${index}`} data-order-id={order._id}>
                         <td data-testid={`order-id-${index}`}><code>{order._id.substring(20, 24)}</code></td>
                         <td data-testid={`order-user-${index}`}>{order.user?.name || order.user?.email || 'N/A'}</td>
                         <td data-testid={`order-date-${index}`}>{order.createdAt?.substring(0, 10)}</td>
                         <td data-testid={`order-total-${index}`}><strong>${order.totalPrice}</strong></td>
                         <td data-testid={`order-paid-${index}`}>{order.isPaid ? <span style={{color:'#28a745'}}>✓ {order.paidAt?.substring(0,10)}</span> : <span style={{color:'#dc3545'}}>✗ Not paid</span>}</td>
                         <td data-testid={`order-delivered-${index}`}>{order.isDelivered ? <span style={{color:'#28a745'}}>✓ {order.deliveredAt?.substring(0,10)}</span> : <span style={{color:'#dc3545'}}>✗ Not delivered</span>}</td>
                         <td><a href={`/order/${order._id}`} className={DashboardStyles.view_link} data-testid={`view-order-${index}`}>View Details</a></td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             </>}
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
