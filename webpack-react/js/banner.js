var React = require('react');
var styles = require('../../elements/banner/main.css');

var Banner = React.createClass({
	render : function() {
		return (
			<div className={styles.banner}>
				<h1>
					<a>White Label</a>
				</h1>
			</div>
		);
	}
});

module.exports = Banner;