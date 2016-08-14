import React from 'react';
import {Link} from 'react-router';
import Banner from './banner';

export default class Layout extends React.Component {
	render () {

		let containerStyles = {
			margin : 'auto',
			width : '1000px'
		}

		return (
			<div style={ containerStyles}>
				<Banner/>
				<div>
					{ this.props.children }
				</div>
			</div>
			);
	}
}