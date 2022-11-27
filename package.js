/* global Package */

Package.describe({
  name: 'hschmaiske:react-router-ssr',
  version: '1.0.0',
  summary: 'Re-implementation of Meteor-Community-Packages/react-router-ssr',
  git: 'https://github.com/henriquealbert/react-router-ssr.git',
  documentation: 'README.md',
});

Package.onUse(function _ (api) {
  api.versionsFrom('2.3');
  api.use([
    'ecmascript',
    'communitypackages:fast-render@4.0.0',
    'tmeasday:check-npm-versions@1.0.2',
  ]);

  api.mainModule('client.jsx', 'client');
  api.mainModule('server.jsx', 'server');
});
