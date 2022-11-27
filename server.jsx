/* eslint-disable react/prop-types */
import { FastRender } from 'meteor/communitypackages:fast-render';

import React from 'react';
import { Helmet } from 'react-helmet';
import { StaticRouter } from 'react-router-dom/server';
import ReactDom from 'react-dom'; // eslint-disable-line no-unused-vars
import { renderToString, renderToStaticMarkup } from 'react-dom/server';

import { isAppUrl } from './helpers';
import './version-check';

const helmetTags = [
  'base',
  'meta',
  'link',
  'script',
  'style',
  'title',
  'noscript',
];

let stylesServer, ServerStyles, createStylesServer;

try {
  ({ createStylesServer, ServerStyles } = require('@mantine/ssr'));

  stylesServer = createStylesServer();
} catch (e) { }

/* eslint-enable */

export const renderWithSSR = (component, { renderTarget = 'react-target' } = {}) => {
  FastRender.onPageLoad(sink => {
    if (!isAppUrl(sink.request)) {
      return;
    }

    const ReactRouterSSR = ({ location }) => (
      <StaticRouter location={ location } context={ {} }>
        { component }
      </StaticRouter>
    );

    const AppJSX = <ReactRouterSSR location={ sink.request.url } />;
    const renderedString = renderToString(AppJSX);

    if (ServerStyles && stylesServer) {
      sink.appendToHead(
        renderToStaticMarkup(
          <ServerStyles html={renderedString} server={stylesServer} />,
        ),
      );
    }

    sink.renderIntoElementById(renderTarget, renderedString);

    const helmet = Helmet.renderStatic();
    helmetTags.forEach(tag => {
      sink.appendToHead(helmet[tag].toString());
    });
  });
};
