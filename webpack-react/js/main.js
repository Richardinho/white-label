// main.js
var React = require('react');  // not used explicitly in this file but still needed
var ReactDOM = require('react-dom');
var Layout = require('./layout');

ReactDOM.render(
	<Layout />,
	document.getElementById('app')
);