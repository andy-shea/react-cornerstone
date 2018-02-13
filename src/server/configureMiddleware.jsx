import React from 'react';
import {renderToString} from 'react-dom/server';
import {Provider} from 'react-redux';
import {NOT_FOUND} from 'redux-first-router';
import HttpError from './HttpError';

function configureMiddleware(configureStore, createRoutesConfig, Component, template, {getInitialState, getHelpers}) {
  return async (req, res, next) => {
    try {
      const initialState = getInitialState ? await getInitialState(req) : {};
      const helpers = getHelpers ? getHelpers(req) : {};
      const routesConfig = {
        ...createRoutesConfig(helpers),
        initialEntries: [req.url]
      }
      const {store, thunk} = configureStore(false, routesConfig, initialState, req);
      await thunk(store);

      const {type, kind, pathname, search} = store.getState().location;
      let status = 200;
      if (type === NOT_FOUND) status = 404;
      else if (kind === 'redirect') return res.redirect(302, search ? pathname + '?' + search : pathname);

      const html = renderToString(<Provider store={store}><Component/></Provider>);
      res.status(status).send(template(html, store.getState()));
    }
    catch (err) {
      next(err);
    }
  };
}

export default configureMiddleware;
