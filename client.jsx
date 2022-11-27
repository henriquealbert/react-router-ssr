import { FastRender } from 'meteor/communitypackages:fast-render';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import './version-check';

const renderWithSSR = (
  appComponent,
  { renderTarget = 'react-target' } = {},
) => {
  const ReactRouterSSR = () => <BrowserRouter>{appComponent}</BrowserRouter>;

  FastRender.onPageLoad(() => {
    ReactDOM.hydrate(<ReactRouterSSR />, document.getElementById(renderTarget));
  });
};

export { renderWithSSR };
