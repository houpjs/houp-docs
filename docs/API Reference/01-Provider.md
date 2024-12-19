`<Provider />` is a function component that provides all stores under the same namespace.

## Overview

The global `<Provider />` component that provides all globally registered stores. It is recommended to use it at the root of your application.

## Usage

Because it is a regular function component, not a Context Provider, so it doesn't need to wrap the App. This means that `<Provider />` and the App will not affect each other. However, it's important to render it before any component that uses `useStore`, which is why it should be placed above the App.

``` tsx
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "houp";

createRoot(document.getElementById("root")!).render(
  <>
    <Provider />
    <App />
  </>,
)

```

## createProvider

```tsx
CreateProvider(): StoreProvider
```

In most cases, using a global `<Provider />` is sufficient. However, if you're rendering different components into separate DOM nodes, you may need to create individual providers for each one.

In this example, two distinct React components are rendered into two different DOM nodes.

``` tsx
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import App2 from "./App2.tsx";
import { Provider, CreateProvider } from "houp";

createRoot(document.getElementById("root1")!).render(
  <>
    <Provider />
    <App />
  </>,
)

export const App2Provider = CreateProvider();
createRoot(document.getElementById("root2")!).render(
  <>
    <App2Provider />
    <App2 />
  </>,
)

```

In this case, `App` and `App2` use separate providers to avoid conflicts, as registerStore registers the store to the global `<Provider />` by default. In `App2`, you can use the following code to register the store to the `<App2Provider />`. 

```tsx
registerStore(someHook, App2Provider);
```

This will ensure that you can still access your store in `App2` even after `App` is unmounted.

## Troubleshooting

### I got a warning: `Multiple identical Providers are mounted. Please ensure that each Provider is only mounted once to avoid potential unexpected behavior.`

This is usually caused by placing the same provider in different locations at the same time. For example, if you have components `ComponentA` and `ComponentB`, and you place the same provider in both `ComponentA` and `ComponentB`, and both components are mounted simultaneously in your app, this will trigger the warning.

```tsx
function ComponentA() {
    return (
        <>
        <Provider />
        <Rest />
        </>
    );
}
```

```tsx
function ComponentB() {
    return (
        <>
        <Provider />
        <Rest />
        </>
    );
}
```