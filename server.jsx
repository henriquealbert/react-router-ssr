/* eslint-disable react/prop-types */
import { FastRender } from 'meteor/staringatlights:fast-render';

import React from 'react';
import { Helmet } from 'react-helmet';
import { StaticRouter } from 'react-router';
import { renderToString } from 'react-dom/server';

import { isAppUrl } from './helpers';
import './version-check';

let Provider;
let applyMiddleware;
let createStore;
let ServerStyleSheet;

/* eslint-disable */
try {
  ({ Provider } = require('react-redux'));
  ({ createStore, applyMiddleware } = require('redux'));
} catch (e) {}

try {
  ({ ServerStyleSheet } = require('styled-components'));
} catch (e) {}

/* eslint-enable */

export const renderWithSSR = (component, { storeOptions } = {}) => {
  FastRender.onPageLoad(async sink => {
    if (!isAppUrl(sink.request)) {
      return;
    }

    let ReactRouterSSR = ({ location }) => (
      <StaticRouter location={location} context={{}}>
        {component}
      </StaticRouter>
    );

    if (storeOptions) {
      const { rootReducer, initialState, middlewares } = storeOptions;
      const appliedMiddlewares = middlewares
        ? applyMiddleware(...middlewares)
        : null;

      const store = createStore(rootReducer, initialState, appliedMiddlewares);

      ReactRouterSSR = ({ location }) => (
        <Provider store={store}>
          <StaticRouter location={location} context={{}}>
            {component}
          </StaticRouter>
        </Provider>
      );

      /* eslint-disable */
      sink.appendToHead(`
          <script>
              window.__PRELOADED_STATE__ = ${JSON.stringify(
                store.getState()
              ).replace(/</g, '\\u003c')}
          </script>
      `);
      /* eslint-enable */
    }

    let AppJSX;

    if (ServerStyleSheet) {
      const sheet = new ServerStyleSheet();
      AppJSX = sheet.collectStyles(
        <ReactRouterSSR location={sink.request.url} />
      );
    } else {
      AppJSX = <ReactRouterSSR location={sink.request.url} />;
    }

    const renderedString = renderToString(AppJSX);

    sink.renderIntoElementById('react-app', renderedString);

    const helmet = Helmet.renderStatic();
    sink.appendToHead(helmet.meta.toString());
    sink.appendToHead(helmet.title.toString());
  });
};
