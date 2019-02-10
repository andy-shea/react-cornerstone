import {combineReducers, createStore, applyMiddleware, compose} from 'redux';
import {connectRoutes} from 'redux-first-router';
import thunkMiddleware from 'redux-thunk';

function configureStoreCreator(reducers, middleware = () => [thunkMiddleware]) {
  return (forClient, {map, ...routesConfig}, initialState = {}, req) => {
    const {reducer, middleware: routerMiddleware, enhancer, thunk} = connectRoutes(
      map,
      routesConfig
    );
    const rootReducer = combineReducers({location: reducer, ...reducers});
    const devToolsEnhancer =
      forClient && window.__REDUX_DEVTOOLS_EXTENSION__
        ? window.__REDUX_DEVTOOLS_EXTENSION__()
        : f => f;
    const store = createStore(
      rootReducer,
      initialState,
      compose(
        enhancer,
        applyMiddleware(routerMiddleware, ...middleware(req)),
        devToolsEnhancer
      )
    );
    return {store, thunk};
  };
}

export default configureStoreCreator;
