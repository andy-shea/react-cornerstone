import React from 'react';
import {render as renderToDom} from 'react-dom';
import {Provider} from 'react-redux';
import createHistory from 'history/createBrowserHistory';

function render(configureStore, createRoutesConfig, Component, mountTo, helpers = {}) {
  const {store} = configureStore(true, createRoutesConfig(helpers), createHistory(), window.__INITIAL_STATE__);
  renderToDom(<Provider store={store}><Component/></Provider>, mountTo);
  return store;
}

export default render;
