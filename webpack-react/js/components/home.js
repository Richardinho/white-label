import {Link} from 'react-router';
import React from 'react';
import { aside, content } from '../../../elements/layout/main.css';
import emperorAPI from '../emperor-api';
import store from '../store';
import { connect } from 'react-redux';
import resultsAction from '../results-action';
import criteriaActions from '../criteria-actions';
import Filters from './filters';
import Results from './results';
import getQueryStringFromModel from '../get-query-string';

class Home extends React.Component {

	constructor () {

		super();

		this.handleDynastyChange = this.handleDynastyChange.bind(this);
		this.handleSortOrderChange = this.handleSortOrderChange.bind(this);
		this.handleYearFromChange = this.handleYearFromChange.bind(this);
		this.handleYearToChange = this.handleYearToChange.bind(this);
	}

	componentDidMount() {
		emperorAPI.load().then( data => {
			store.dispatch(criteriaActions.initial(data.criteria));
			store.dispatch(resultsAction(data.results));
		});
	}

	handleDynastyChange (event) {
		store.dispatch(criteriaActions.dynasty(event.target.value));
		this.updateResults();
	}

	handleSortOrderChange (event) {
		store.dispatch(criteriaActions.sortOrder(event.target.value));
		this.updateResults();
	}

	handleYearFromChange (event) {
		store.dispatch(criteriaActions.yearFrom(event.target.value));
		this.updateResults();
	}

	handleYearToChange (event) {
		store.dispatch(criteriaActions.yearTo(to));
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
						handleYearFromChange={this.handleYearFromChange}
						handleYearToChange={this.handleYearToChange}
						handleDynastyChange={this.handleDynastyChange}
						handleSortOrderChange={this.handleSortOrderChange}/>
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
