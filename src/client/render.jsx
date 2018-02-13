import React from 'react';
import {hydrate} from 'react-dom';
import {Provider} from 'react-redux';
import {AppContainer} from 'react-hot-loader';

function render(configureStore, createRoutesConfig, Component, mountTo, helpers = {}) {
  const {store} = configureStore(true, createRoutesConfig(helpers), window.__INITIAL_STATE__);
  const reload = () => hydrate(
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
