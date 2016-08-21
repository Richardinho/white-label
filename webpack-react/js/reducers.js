import { combineReducers } from 'redux';

import resultReducer from './result-reducer';
import criteriaReducer from './criteria-reducer';

// Combine Reducers
var reducers = combineReducers({
	resultState : resultReducer,
	criteriaState : criteriaReducer
});

export default reducers;