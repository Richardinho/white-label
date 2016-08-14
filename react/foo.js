import {Link} from 'react-router';
import React from 'react';

export default class Foo extends React.Component {
	render () {
		return <h2>This is foo<Link to="/">home</Link></h2>;
	}
}