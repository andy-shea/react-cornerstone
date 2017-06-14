import React from 'react';
import {renderToString} from 'react-dom/server';
import {match, createMemoryHistory} from 'react-router';
import {Provider} from 'react-redux';
import {syncHistoryWithStore} from 'react-router-redux';
import {ReduxAsyncConnect, loadOnServer} from 'redux-connect';
import HttpError from './HttpError';

function configureMiddleware(configureStore, createRoutes, template, {getInitialState, getHelpers}) {
  return (req, res, next) => {
    const {url} = req;
    const memoryHistory = createMemoryHistory(url);
    const initialState = getInitialState ? getInitialState(req) : {};
    const store = configureStore(false, memoryHistory, initialState, req);
    const history = syncHistoryWithStore(memoryHistory, store);
    match({history, routes: createRoutes(store), location: url}, (err, redirectLocation, renderProps) => {
      if (err) next(err);
      else if (redirectLocation) res.redirect(302, redirectLocation.pathname + redirectLocation.search);
      else if (renderProps) {
        loadOnServer({...renderProps, store, helpers: getHelpers ? getHelpers(req) : {}}).then(() => {
          const html = renderToString(
            <Provider store={store}>
              <ReduxAsyncConnect {...renderProps}/>
            </Provider>
          );
          res.send(template(html, store.getState()));
        }).catch(next);
      }
      else next(HttpError.notFound());
    });
  }
}

export default configureMiddleware;
