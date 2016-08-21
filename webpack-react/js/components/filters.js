import { Link } from 'react-router';
import React from 'react';
import { menu, rangeFilters } from '../../styles/filters.scss';

export default (props) => {

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
								 min={ props.minYear }
								 max={ props.maxYear }
								 value={ props.yearFrom }
								 onChange={ props.handleYearFromChange }
								 />
					<label htmlFor='year-from'>{ props.yearFrom }</label>
				</li>
				<li className={ rangeFilters }>
					<label htmlFor='year-to'>to</label>
					<input id='year-to'
								 type='range'
								 step='1'
								 min={ props.minYear }
								 max={ props.maxYear }
								 value={ props.yearTo }
								 onChange={ props.handleYearToChange }
								 />
					<label htmlFor='year-to'>{ props.yearTo }</label>
				</li>
			</ul>
			<h4 htmlFor='dynasties'>Dynasty</h4>
			<select value={props.dynasty} id='dynasties' onChange={ props.handleDynastyChange } >
				{
					props.dynasties.map( (dynasty, index) => {
						return (
							<option key={ index }>{ dynasty }</option>
						);
					})
				}
			</select>
			<h3>Sort by</h3>
			<select value={props.sortBy} id='sort-by' onChange={ props.handleSortOrderChange }>
				{
					props.sortingOrders.map((sortOrder, index) => {
						return (
							<option key={index}>{ sortOrder }</option>
						);
					})
				}
			</select>
		</div>
	);
}
