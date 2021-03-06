# React Cornerstone

A starter kit to form the cornerstones of your React, Redux, universal app

## Install

```
yarn add react-cornerstone
```

## Tech Stack

- [**React**](https://github.com/facebook/react) - Component-based UI library
- [**Redux**](https://github.com/reactjs/redux) - State management and data flow
- [**Redux-First Router**](https://github.com/faceyspacey/redux-first-router) - Redux-oriented routing
- [**Express**](https://github.com/expressjs/express) - Server-side framework
- [**React Hot Loader**](https://github.com/gaearon/react-hot-loader) - Hot module replacement that works with react+redux

## Usage

### Client

In your client entry point, call the `render` function from `react-cornerstone` passing in a
function to `configureStore`, a function to `createRoutes`, a DOM element designating the
mount point of the app, and any helpers to be made available to the redux-connect [`asyncConnect`](https://github.com/makeomatic/redux-connect/blob/master/docs/API.MD#asyncconnect-decorator)
decorator. The created store will be returned if you need to use it further in your
client setup (for example, you may want your incoming web socket events to dispatch actions).

```javascript
import {render} from 'react-cornerstone';

const {store} = render(configureStore, createRoutesConfig, Component, document.getElementById('app'), helpers)
```

`configureStore` and `createRoutesConfig` are expected to be
[universal](https://medium.com/@mjackson/universal-javascript-4761051b7ae9) functions returning
both the redux store and the routes config, respectively. More information on these can be found
under the [common section](#common) below.

The `Component` is the main bootstrap/app component rendered which will need to, amongst other
app-specific things, render the correct component when a new location is reduced.

#### Hot Module Replacement

`render` also returns a function called `reload` which can be used to swap out the top level `Component` passed to it when the file has changed. See the [react-hot-loader docs](https://github.com/gaearon/react-hot-loader/tree/master/docs#migration-to-30) for more information on how to set this up correctly.

```javascript
import Component from './path/to/Component';

const {reload} = render(configureStore, createRoutesConfig, Component, document.getElementById('app'))

if (module.hot) module.hot.accept('./path/to/Component', reload);
```

### Server

In your server entry point, call the `configureMiddleware` function from `react-cornerstone` passing in the
same `configureStore` and `createRoutes` functions as used in the client configuration, a `template`
function for displaying the HTML including the mount point DOM element, and, optionally an object
with the following configuration functions:

- `getInitialState(req)` - Receives the Express request object and should return the initial
  state to be passed to the `configureStore` function.  Useful if you need to, for example, add the
  authenticated user to the initial state.

- `getHelpers(req)` - Also receives the Express request object and should return an object containing
  any helpers to be made available to the redux-connect [`asyncConnect`](https://github.com/makeomatic/redux-connect/blob/master/docs/API.MD#asyncconnect-decorator)
  decorator.

The server-side `configureMiddleware` function will return an Express middleware that uses react-route's `match`
function to work out the active `<Route/>` and, with the corresponding components, redux-connect's
`loadOnServer` is used to load any asynchronous data to initiate the redux store with.

```javascript
import {configureMiddleware} from 'react-cornerstone';

const middleware = configureMiddleware(configureStore, createRoutesConfig, Component, template, {getInitialState, getHelpers})
```

The `template` function will be passed the output of `react-dom/server`'s `renderToString`
as the first parameter and the initial state as second.  It is expected to at least return
the page HTML including the mount point and the initial state javascript in a variable called
`window.__INITIAL_STATE__` along with the client-side code bundle. For example:

```javascript
function template(componentHtml, initialState) {
  return `
    <!doctype html>
    <html>
    <body>
      <div id="mount">${componentHtml}</div>
      <script>
        window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
      </script>
      <script src="/client.js"></script>
    </body>
    </html>
  `
}
```

### Common

#### `configureStore(forClient, {map, ...options}, history, initialState = {})`

- `forClient` - a boolean to distinguish between client and server contexts. Obviously on the
  client-side this will be `true` and on the server, `false`.
- `{map, [...options]}` - the route config to be passed to `redux-first-router`.  The `map`
  will be the routes supplied to `connectRoutes` and any further properties will be passed along as
  the `options` parameter (see [`connectRoutes` documentation](https://github.com/faceyspacey/redux-first-router/blob/master/docs/connectRoutes.md#options)).
- `history` - the history strategy used by react-router. On the client-side this will be
  `browserHistory` and on the server, `memoryHistory`.
- `initialState` - the initial state to seed the redux store with.  On the client-side this will
   be the contents of `window.__INITIAL_STATE__` and on the server, either an empty object or the
   result of calling `getInitialState` if passed to the server-side `configureMiddleware` function.

It is expected to return the store created by a call to redux's `createStore`.
An opinionated implementation can be created by using the `configureStoreCreator(reducers, [middleware])`
function from `react-cornerstone`. Simply pass in your reducers and, optionally, an array of
middleware:

```javascript
import {configureStoreCreator} from 'react-cornerstone';

const configureStore = configureStoreCreator(reducers);
```

The configured store will include a reducer and middleware from `react-router-redux` to keep
react-router and redux in sync, along with a reducer from `redux-connect` to track asynchronous
data loading. [Dev Tools Extension](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)
support will also be included if `forClient` is `true`.

**Note: if a custom middleware stack is not provided via the optional `middleware` parameter,
[`redux-thunk`](https://github.com/gaearon/redux-thunk) is included by default to handle
asynchronous actions.**

#### `createRoutes(store)`

- `store` - the redux store.  On both the client and server, this will be the store created by
  calling `configureStore` as defined above. This can be useful if you need to check some store
  property and react to it in a route's `onEnter` event handler.

The return value should be the `<Route/>` configuration to be utilised by `react-router`.

## Useful Links

- [Octopush](https://github.com/andy-shea/octopush) - an app built upon React Cornerstone

## Licence

[MIT](./LICENSE)
