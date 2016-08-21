let initialState = {
	yearFrom : 0,
	yearTo : 0,
	minYear : -50,
	maxYear : 400,
	dynasties : [
		'foo', 'bar'
	],
	dynasty : 'Julio-Claudian',
	sortBy : 'succession',
	sortingOrders : [
		'apple', 'orange'
	]
};

export default function(state = initialState, action) {
	switch(action.type) {
		case 'INITIAL' : //  called to populate store from server
			return Object.assign({}, state, action.data);
		case 'YEAR_FROM':
			return Object.assign({}, state, {
				yearFrom : action.yearFrom
			});
		case 'YEAR_TO':
			return Object.assign({}, state, {
				yearTo : action.yearTo
			});
		case 'DYNASTY' :
			return Object.assign({}, state, {
				dynasty : action.dynasty
			});
		case 'SORT_ORDER':
			return Object.assign({}, state, {
				sortBy : action.sortOrder
			});
		default :
			return state;
	}
}