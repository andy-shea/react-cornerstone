import {createStore, combineReducers, compose, applyMiddleware} from 'redux';
import {routerReducer, routerMiddleware} from 'react-router-redux';
import {reducer as reduxAsyncConnect} from 'redux-connect';
import thunkMiddleware from 'redux-thunk';

function configureStoreCreator(reducers, middleware = () => [thunkMiddleware]) {
  const reducer = combineReducers({
    routing: routerReducer,
    reduxAsyncConnect,
    ...reducers
  });

  return (forClient, history, initialState = {}, req) => {
    const devToolsEnhancer = forClient && window.devToolsExtension ? window.devToolsExtension() : f => f;
    return createStore(
      reducer,
      initialState,
      compose(
        applyMiddleware(
          ...middleware(req),
          routerMiddleware(history)
        ),
        devToolsEnhancer
      )
    );
  };
}

export default configureStoreCreator;
