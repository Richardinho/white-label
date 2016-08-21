import React from 'react';
import { searchResultItem, addInfo } from '../../styles/results.scss';

export default class Results extends React.Component {

	createUrl (id) {
		return 'http://localhost:4000/images/medium/' + id + '.jpg';
	}
	render () {
		return (
			<ol>
				{this.props.results.map((result) => {
						return (
							<li key={ result.id }>
								<div className={[searchResultItem, 'media'].join(' ')}>
									<a className='media-image'>
										<img alt="" src={ this.createUrl(result.id)}/>
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