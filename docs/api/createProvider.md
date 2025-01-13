---
sidebar_position: 1
sidebar_label: createProvider
title: createProvider
---

`createProvider` creates a `StoreProvider` component that provides store to its child components.
The store will be disposed of when the component is unmounted.

```tsx
createProvider(hooks: StoreHook[]): StoreProvider
```

## Parameters

- `hooks`: An array of hooks that will be used as the store.

## Returns

`StoreProvider` is a React component that provides store to its child components.

## Usage

### Use a single root provider

```tsx title="provider.ts"
// ...
import { createProvider } from "houp";

export const Provider = createProvider([someHook, someHook2]);
```

```tsx title="main.tsx"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App"
import { Provider } from "./provider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider>
      <App />
    </Provider>
  </StrictMode>,
)
```

### Use standalone provider

In most cases, using a single provider is sufficient. However, if you're rendering different components into separate DOM nodes or need a scoped store, you may need to create a standalone provider.

In this example, two distinct React components are rendered into two different DOM nodes.

```tsx title="provider1.ts"
// ...
import { createProvider } from "houp";

export const App1Provider = createProvider([someHook, someHook2]);
```

```tsx title="provider2.ts"
// ...
import { createProvider } from "houp";

export const App2Provider = createProvider([someHook, someHook3, someHook4]);
```

``` tsx title="main.tsx"
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import App2 from "./App2";
import { App1Provider } from "./provider1";
import { App2Provider } from "./provider2";

createRoot(document.getElementById("root1")!).render(
    <App1Provider>
        <App />
    </App1Provider>
)

createRoot(document.getElementById("root2")!).render(
    <App2Provider>
        <App2 />
    </App2Provider>
)

```

In this case, `App` uses `App1Provider`, while `App2` uses `App2Provider`. 
In `App` or `App2`, you can use the following code to access the store.

```tsx title="component in App"
import { useStore } from "houp";

useStore(someHook);
```

This will ensure that the stores in `App` and `App2` are independent of each other, even though they use the same hook.