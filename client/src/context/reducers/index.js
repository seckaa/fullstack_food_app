import {combineReducers} from 'redux';
import userReducer from './userReducer';
import alertReducer from './alertReducer';
import productReducer from './productReducer';

const myReducers = combineReducers({
    user: userReducer,
    alert: alertReducer,
    products: productReducer,
});

export default myReducers;


