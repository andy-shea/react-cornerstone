# React Cornerstone

A starter kit to form the cornerstones of your React, Redux, universal app

## Install

```
yarn add react-cornerstone
```

## Tech Stack

- **React** - Component-based UI library
- **React Router** - Declarative routing for React
- **Redux** - State management and data flow
- **Redux Connect** - Universal, asynchronous data loading for components
- **Express** - Server-side framework

## Usage

### Client

####

In your client entry point, call the `render` function from `react-cornerstone/client` passing in a
function to `configureStore`, a function to `createRoutes`, and a DOM element designating the
mount point of the app.  The created store will be returned if you need to use it further in your
client setup (for example, you may want your incoming web socket events to dispatch actions).

```javascript
import {render} from 'react-cornerstone/client';

const store = render(configureStore, createRoutes, document.getElementById('app'));
```

`configureStore` and `createRoutes` are expected to be
[universal](https://medium.com/@mjackson/universal-javascript-4761051b7ae9) functions returning
both the redux store and react routes, respectively. More information on these can be found
under the [common section](#common) below.

### Server

In your server entry point, call the `configureMiddleware` function from `react-cornerstone/server` passing in the
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
import {configureMiddleware} from 'react-cornerstone/server';

const middleware = configureMiddleware(configureStore, createRoutes, template, {getInitialState, getHelpers});
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

#### `configureStore(forClient, history, initialState)`

- `forClient` - a boolean to distinguish between client and server contexts. Obviously on the
  client-side this will be `true` and on the server, `false`.
- `history` - the history strategy used by react-router. On the client-side this will be
  `browserHistory` and on the server, `memoryHistory`.
- `initialState` - the initial state to seed the redux store with.  On the client-side this will
   be the contents of `window.__INITIAL_STATE__` and on the server, either an empty object or the
   result of calling `getInitialState` if passed to the server-side `configureMiddleware` function.

It is expected to return the store created by a call to redux's `createStore`.
An opinionated implementation can be created by using the `configureStoreCreator(reducers, [middleware])`
function from `react-cornerstone/common`. Simply pass in your reducers and, optionally, an array of
middleware:

```javascript
import {configureStoreCreator} from 'react-cornerstone/common';

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

- [Octopush](https://github.com/octahedron/octopush) - an app built upon React Cornerstone

## Licence

[MIT](./LICENSE)
