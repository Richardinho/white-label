import {Router, Route, browserHistory, Link} from 'react-router';
import React from 'react';
import ReactDOM from 'react-dom';
import Home from './home';
import Foo from './foo';
import Layout from './layout';

ReactDOM.render((
	<Router history={browserHistory}>
		<Route component={Layout}>
			<Route path="/" component={Home} />
		</Route>
		<Route path="/foo" component={Foo} />
	</Router>
), document.getElementById('app'));

