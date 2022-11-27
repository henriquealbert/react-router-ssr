import { FastRender } from 'meteor/communitypackages:fast-render';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import './version-check';

const renderWithSSR = (appComponent, { renderTarget = 'react-target' } = {}) => {
  const ReactRouterSSR = ({ location }) => (
        <BrowserRouter location={location}>
            {appComponent}
        </BrowserRouter>
  );

  FastRender.onPageLoad((sink) => {
    ReactDOM.hydrate(<ReactRouterSSR location={sink.request.url} />, document.getElementById(renderTarget));
  });
};

export { renderWithSSR };
