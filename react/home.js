import emperorApi from './emperorAPI';
import {Link} from 'react-router';
import React from 'react';

import Results from './results';

export default class Home extends React.Component {

	constructor () {
		super();
		this.state = { criteria : {} };
	}

	componentDidMount () {
		emperorApi.load().then(data =>  {
			this.setState({ criteria : data.criteria });
		});
	}

	render () {
		let results = [
			{ id : 1, text : 'foo'},
			{ id : 2, text : 'bar'},
			{ id : 3, text : 'bix'}
			];

		return (
			<div>
				<Results results={results}/>
			</div>
		);
	}
}