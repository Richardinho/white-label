import React from 'react';
import {Link} from 'react-router';

export default class Other extends React.Component {
	render () {
		return (
			<div>
			other
				<Link to="/">home</Link>
			</div>
		);
	}
}