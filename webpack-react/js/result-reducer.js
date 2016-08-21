let initialState = {
	results : []
};

export default function(state = initialState, action) {
	switch(action.type) {
		case 'results':
			return Object.assign({}, state, { results : action.results });
		default :
			return state;
	}
}