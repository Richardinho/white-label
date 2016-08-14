import React from 'react';


export default class Results extends React.Component {


	render () {

		return (
			<ol>
				{this.props.results.map(function(result) {
					return <li key={result.id}>{result.text}</li>;
				})}
			</ol>
		);

	}



}