import { combineReducers } from 'redux';

import resultReducer from './result-reducer';
import criteriaReducer from './criteria-reducer';

// Combine Reducers
let reducers = combineReducers({
	resultState : resultReducer,
	criteriaState : criteriaReducer
});

export default reducers;