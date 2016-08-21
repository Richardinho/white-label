import { Link } from 'react-router';
import React from 'react';
import { menu, rangeFilters } from '../styles/filters.scss';

export default class Filter extends React.Component {

	constructor () {

		super();
		//  Why is it necessary to bind to this?
		this.handleDynastyChange = this.handleDynastyChange.bind(this);
		this.handleSortOrderChange = this.handleSortOrderChange.bind(this);
		this.handleYearFromChange = this.handleYearFromChange.bind(this);
		this.handleYearToChange = this.handleYearToChange.bind(this);
	}

	handleDynastyChange (event) {
		this.props.setDynasty(event.target.value);
	}

	handleSortOrderChange (event) {
		this.props.setSortOrder(event.target.value);
	}

	handleYearFromChange (event) {
		this.props.setYearFrom(event.target.value);
	}

	handleYearToChange (event) {
		this.props.setYearTo(event.target.value);
	}

	render () {

		return (
			<div className={menu}>
				<h2>Filters</h2>
				<ul>
					<h3>Time range</h3>
					<li className={ rangeFilters }>
						<label htmlFor='year-from'>from</label>
						<input id='year-from'
									 type='range'
									 step='1'
									 min={ this.props.minYear }
									 max={ this.props.maxYear }
									 value={ this.props.yearFrom }
									 onChange={ this.handleYearFromChange }
									 />
						<label htmlFor='year-from'>{ this.props.yearFrom }</label>
					</li>
					<li className={ rangeFilters }>
						<label htmlFor='year-to'>to</label>
						<input id='year-to'
									 type='range'
									 step='1'
									 min={ this.props.minYear }
									 max={ this.props.maxYear }
									 value={ this.props.yearTo }
									 onChange={ this.handleYearToChange }
									 />
						<label htmlFor='year-to'>{ this.props.yearTo }</label>
					</li>
				</ul>
				<h4 htmlFor='dynasties'>Dynasty</h4>
				<select value={this.props.dynasty} id='dynasties' onChange={ this.handleDynastyChange } >
					{
						this.props.dynasties.map( (dynasty, index) => {
							return (
								<option key={ index }>{ dynasty }</option>
							);
						})
					}
				</select>
				<h3>Sort by</h3>
				<select value={this.props.sortBy} id='sort-by' onChange={ this.handleSortOrderChange }>
					{
						this.props.sortingOrders.map((sortOrder, index) => {
							return (
								<option key={index}>{ sortOrder }</option>
							);
						})
					}
				</select>
			</div>
		);
	}
}