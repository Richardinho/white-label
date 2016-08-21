import React from 'react';
import Banner from './banner';
import styles from '../styles/layout.scss';

export default class Layout extends React.Component {
	render () {
		return (
			<div className={ styles.container }>
				<Banner/>
				{ this.props.children }
			</div>
		);
	}
}