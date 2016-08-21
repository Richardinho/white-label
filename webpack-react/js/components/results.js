import React from 'react';
import { searchResultItem, addInfo } from '../../styles/results.scss';

let createUrl = (id) => {
	return 'http://localhost:4000/images/medium/' + id + '.jpg';  //  use  ES2015 template
}

export default class Results extends React.Component {

	render () {
		return (
			<ol>
				{this.props.results.map((result) => {
						return (
							<li key={ result.id }>
								<div className={[searchResultItem, 'media'].join(' ')}>
									<a className='media-image'>
										<img alt="" src={ createUrl(result.id)}/>
									</a>
									<div className="media-body">
										<h3><a data-internal-link href="/emperor?id={ result.id }">{ result.name }</a></h3>
										<div className={ addInfo }>{ result.from } { result.to }
										</div>
									</div>
								</div>
							</li>
						)
				})}
			</ol>
		);
	}
}