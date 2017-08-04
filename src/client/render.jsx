import React from 'react';
import {render as renderToDom} from 'react-dom';
import {Provider} from 'react-redux';
import {AppContainer} from 'react-hot-loader';
import createHistory from 'history/createBrowserHistory';

function render(configureStore, createRoutesConfig, Component, mountTo, helpers = {}) {
  const {store} = configureStore(true, createRoutesConfig(helpers), createHistory(), window.__INITIAL_STATE__);
  const reload = () => renderToDom(
    <AppContainer>
      <Provider store={store}>
        <Component/>
      </Provider>
    </AppContainer>,
    mountTo
  );
  reload();

  return {store, reload};
}

export default render;
