var React = require('react');
var Banner = require('./banner');
var styles = require('../../elements/layout/main.css');

module.exports = React.createClass({
	render : function () {
		return (
			<div className={styles.container}>
				<Banner/>
				<div className={styles.aside}>
					aside
				</div>
				<div className={styles.content}>
					content
				</div>
			</div>
		);
	}
});