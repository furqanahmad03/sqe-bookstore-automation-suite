import React, { createContext, useContext, useMemo, useState } from 'react';
import Styles from './DropdownMenu.module.scss';

const DropdownContext = createContext();

function useDropdownContext() {
	const context = useContext(DropdownContext);
	if (!context) {
		throw new Error(
			"DropdownMenu compound components can't be used outside the DropDownMenu Component"
		);
	}
	return context;
}

export function DropdownMenu(props) {
	const [on, setOn] = useState(false);
	const value = useMemo(() => ({ on, setOn }), [on]);
	const customClasses = props.className
		? `${props.className} ${Styles.dropdown_menu}`
		: Styles.dropdown_menu;
	let customProps = { ...props, className: customClasses };

	return (
		<DropdownContext.Provider value={value}>
			<div className={customClasses} {...customProps}>
				{props.children}
			</div>
		</DropdownContext.Provider>
	);
}

export function MenuButton(props) {
	const { on, setOn } = useDropdownContext();
	const customClasses = props.className
		? `${props.className} ${Styles.menu_button}`
		: Styles.dropdown_menu;
	return (
		<button
			className={customClasses}
			onClick={() => setOn(!on)}
			aria-haspopup="true"
			aria-expanded={on}
			tabIndex="0"
		>
			{props.children}
		</button>
	);
}

export function Menu({ children }) {
	const { on, setOn } = useDropdownContext();
	return on ? (
		<ul className={Styles.menu_wrap} onClick={() => setOn(false)}>
			{children}
		</ul>
	) : null;
}

export function MenuItem({ children, ...props }) {
	const { on } = useDropdownContext();
	return on ? (
		<li className={Styles.menu_item} {...props}>
			{children}
		</li>
	) : null;
}
