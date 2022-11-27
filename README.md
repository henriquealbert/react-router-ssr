# React-Router-SSR v6 with Mantine SSR

Simple isomorphic React SSR for Meteor with subscribed data re-hydration

## Install

1. First install NPM dependencies

   ```sh
   npm install --save react react-dom react-router-dom react-helmet
   ```

2. Install `hschmaiske:react-router-ssr`

   ```sh
   meteor add hschmaiske:react-router-ssr
   ```

## Package Exports 📦

**`renderWithSSR(rootComponent, [options])`** - Isomorphic app rendering.

- `rootComponent` - The component that encompasses your application. Can be any React element. Routers and Switches are handled by the package so those aren't necessary inside your app.

- `options` - An object of rendering options. Currently there is only a single options, but there may be more options in the future.

  - _`renderTarget`_ - A string specifying the `id` of the element to render your app into. Default is `react-target`

  ```js
  import { renderWithSSR } from "meteor/hschmaiske:react-router-ssr";

  renderWithSSR(<App />, {
    renderTarget: "react-app",
  });
  ```

## Usage ⚙️

By default this package renders your app into an HTML element with an id of `react-target`, so add one to your main HTML file for your project like so, or specify a different id using the `renderTarget` option

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="ie=edge" />
</head>
<body>
  <div id="react-target"></div>
</body>
```

In shared code, such as in a `/both/main.jsx` file, or in a file that is imported into your `mainModule` for both the client and server..

```js
import { renderWithSSR } from "meteor/hschmaiske:react-router-ssr";
import { useTracker } from "meteor/react-meteor-data";

import React from "react";
import { Route, Routes } from "react-router-dom";
import DashboardPage from "./imports/ui/pages/dashbaord";
import ProfilePage from "./imports/ui/pages/profile";
import LoginPage from "./imports/ui/pages/login";

const App = () => {
  const { user } = useTracker(() => ({
    user: Meteor.user(),
  }));
  if (user) {
    return (
      <Routes>
        <Route exact path="/" element={DashboardPage} />
        <Route path="/profile/:username" element={ProfilePage} />
      </Routes>
    );
  }

  return <LoginPage />;
};

renderWithSSR(<App />);
```

## Mantine

If the [mantine](https://mantine.dev/) package is installed in your project, this package will detect it's presence, collect all styles, and use them to render your app.
You need to make sure that you have all mantine packages installed:
`@mantine/core @mantine/ssr @emotion/react @emotion/server`
