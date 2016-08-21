import {Link} from 'react-router';
import React from 'react';
import { aside, content } from '../../elements/layout/main.css';
import Results from './results';
import emperorAPI from './emperor-api';
import store from './store';
import { connect } from 'react-redux';
import resultsAction from './results-action';
import criteriaActions from './criteria-actions';
import Filters from './filters';
import getQueryStringFromModel from './get-query-string';

class Home extends React.Component {

	constructor () {

		super();

		this.setYearFrom = this.setYearFrom.bind(this);
		this.setYearTo = this.setYearTo.bind(this);
		this.setDynasty = this.setDynasty.bind(this);
		this.setSortOrder = this.setSortOrder.bind(this);

	}

	componentDidMount() {
		emperorAPI.load().then( data => {
			store.dispatch(criteriaActions.initial(data.criteria));
			store.dispatch(resultsAction(data.results));
		});
	}

	setYearFrom(from){
		store.dispatch(criteriaActions.yearFrom(from));
		this.updateResults();
	}

	setYearTo(to){
		store.dispatch(criteriaActions.yearTo(to));
		this.updateResults();
	}

	setDynasty(dynasty) {
		store.dispatch(criteriaActions.dynasty(dynasty));
		this.updateResults();
	}

	setSortOrder(sortOrder) {
		store.dispatch(criteriaActions.sortOrder(sortOrder));
		this.updateResults();
	}

	updateResults() {
		let queryString = getQueryStringFromModel(store.getState().criteriaState);
		emperorAPI.load(queryString).then( data => {
			store.dispatch(resultsAction(data.results));
		});
	}

	render () {
		console.log('render', this.props.criteria);
		return (
			<div className='clearfix'>
				<div className={ aside }>
					<Filters
						{ ...this.props.criteria }
						setYearFrom={this.setYearFrom}
						setYearTo={this.setYearTo}
						setDynasty={this.setDynasty}
						setSortOrder={this.setSortOrder}/>
				</div>
				<div className={ content }>
					<Results results={ this.props.results } />
				</div>
			</div>
		);
	}
}

const mapStateToProps = function(store) {
	return {
		results: store.resultState.results,
		criteria : store.criteriaState
	};
};

export default connect(mapStateToProps)(Home);
