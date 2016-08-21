import React from 'react';
import Banner from './components/banner';
import styles from '../styles/layout.scss';

export default (props) => {
	return (
		<div className={ styles.container }>
			<Banner/>
			{ props.children }
		</div>
	);
}