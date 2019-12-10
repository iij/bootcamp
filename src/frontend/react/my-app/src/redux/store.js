import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

export default createStore(
    rootReducer,
    compose(
        applyMiddleware(thunk)
    )
);
