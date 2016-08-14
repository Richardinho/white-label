import {Link} from 'react-router';
import React from 'react';

export default class Banner extends React.Component {

		render () {

			let bannerStyles = {
				fontSize : '20px',
				borderBottom : 'solid 2px lightgray',
				background : 'white',
				position : 'relative'
			};

			let headerStyles = {
				margin : 0,
				lineHeight : 1,
				fontSize : '2em',
				color : 'gray',
				padding : '.5em 0',
				textAlign : 'right'
			};

			let linkStyle = {
				textDecoration : 'none',
				color : 'inherit'
			};

			return (
				<div style={ bannerStyles }>
					<h1 style={ headerStyles }>
						<Link style={ linkStyle } to="/foo">White Label</Link>
					</h1>
				</div>
			);
		}
}