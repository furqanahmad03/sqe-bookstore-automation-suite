import { createContext, useReducer } from 'react';
import Cookies from 'js-cookie';

export const Store = createContext();

const initialState = {
	cart: Cookies.get('cart')
		? JSON.parse(Cookies.get('cart'))
		: { cartItems: [], shippingAddress: {}, paymentMethod: '' },
};

function reducer(state, action) {
	switch (action.type) {
		case 'CART_ADD_ITEM': {
			const newItem = action.payload;
			const existItem = state.cart.cartItems.find(
				(item) => item.slug === newItem.slug
			);
			const cartItems = existItem
				? state.cart.cartItems.map((item) =>
						item.name === existItem.name ? newItem : item
				  )
				: [...state.cart.cartItems, newItem];
			Cookies.set('cart', JSON.stringify({ ...state.cart, cartItems }));
			return { ...state, cart: { ...state.cart, cartItems } };
		}
		case 'CART_REMOVE_ITEM': {
			const item = action.payload;
			const cartItems = state.cart.cartItems.filter(
				(product) => product.slug !== item
			);
			Cookies.set('cart', JSON.stringify({ ...state.cart, cartItems }));
			return { ...state, cart: { ...state.cart, cartItems } };
		}
		case 'CART_CLEAR_ITEMS': {
			return { ...state, cart: { ...state.cart, cartItems: [] } };
		}
		case 'SAVE_SHIPPING_ADDRESS':
			return {
				...state,
				cart: {
					...state.cart,
					shippingAddress: {
						...state.cart.shippingAddress,
						...action.payload,
					},
				},
			};
		case 'SAVE_PAYMENT_METHOD':
			return {
				...state,
				cart: {
					...state.cart,
					paymentMethod: action.payload,
				},
			};
		default:
			throw Error('Invalid action type: ' + action.type);
	}
}

export function StoreProvider({ children }) {
	const [state, dispatch] = useReducer(reducer, initialState);
	const value = { state, dispatch };

	return <Store.Provider value={value}>{children}</Store.Provider>;
}
