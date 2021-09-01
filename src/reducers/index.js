import { combineReducers } from 'redux';
import OutComeReducer from './OutComeReducer';

export default combineReducers({
  outcome: OutComeReducer
});
