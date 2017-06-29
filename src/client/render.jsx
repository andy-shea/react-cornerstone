import React from 'react';
import {render as renderToDom} from 'react-dom';
import {Provider} from 'react-redux';
import {ReduxAsyncConnect} from 'redux-connect';
import {Router, browserHistory, applyRouterMiddleware} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';

function render(configureStore, createRoutes, mountTo, {middleware, helpers}) {
  const store = configureStore(true, browserHistory, window.__INITIAL_STATE__);
  const history = syncHistoryWithStore(browserHistory, store);

  renderToDom(
    <Provider store={store}>
      <Router history={history} routes={createRoutes(store)} render={props => (
        <ReduxAsyncConnect helpers={helpers || {}} {...props} render={applyRouterMiddleware(...(middleware || []))}/>
      )}/>
    </Provider>,
    mountTo
  );

  return store;
}

export default render;
