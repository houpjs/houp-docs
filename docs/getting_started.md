---
slug: /
sidebar_position: 1
sidebar_label: Getting Started
title: Getting Started
---

Houp (hook up) is a simple, fast, and reliable solution for sharing a hook's state across multiple components. Whether you're working on a new project or an existing one, integrating Houp is straightforward. It doesn't matter how the hook is created or managed — Houp focuses solely on sharing it.


## Installation

```
npm install houp
```

## Play in Codesandbox

<!-- [![Edit infallible-villani-89k5vf](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/sandbox/infallible-villani-89k5vf) -->

<iframe src="https://codesandbox.io/embed/89k5vf?view=editor+%2B+preview&module=%2Fsrc%2FProduct.tsx"
     style={{width:"100%", height: 500, border:0, borderRadius: 4, overflow:"hidden",}}
     title="houp-sample"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

## Create your hook

Any React hook can be used as a store and shared across components.

``` tsx title="useProduct.ts"
import { useState } from "react";

export default function useProduct() {
    const [price, setPrice] = useState(5);
    const [count, setCount] = useState(100);

    const updatePrice = async () => {
        // await fetch(...)
        setPrice(n => n + 1);
    };

    return {
        price,
        count,
        updatePrice,
        setCount,
    };
}
```

## Create a Provider

`createProvider` creates a `StoreProvider` component that provides the store to its child components. It takes an array of hooks as a parameter, which will be used as the store. Now, we pass `useProduct` as a parameter to `createProvider`.

```tsx title="provider.ts"
import useProduct from "./useProduct";
import { createProvider } from "houp";

export const Provider = createProvider([useProduct]);
```

## Add the Provider to your app

We add the `Provider` at the root of our app so that we can use the store anywhere within the app.

```tsx title="index.tsx"
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

## Now, use it in your components, and you're all set!

Since it's a React Hook, you can use it in any component, and the component will re-render when the state changes.

``` tsx
import { useStore } from "houp";
import useProduct from "./useProduct";

export function ProductCount() {
    const store = useStore(useProduct);

    return (
        <>
            <div>count: {store.count}</div>
        </>
    );
}

export function ProductPrice() {
    const store = useStore(useProduct);

    return (
        <>
            <div>price: {store.price}</div>
        </>
    );
}

export function Updater() {
    const store = useStore(useProduct);

    return (
        <>
            <button onClick={store.updatePrice}>update price</button>
            <button onClick={() => store.setCount(n => n + 1)}>update count</button>
        </>
    );
}
```

:::info

You may have noticed that the `ProductCount` component re-renders even when you click the `update price` button. This happens because `useStore` fetches all the data from the store, causing the component to re-render on every state change. To re-render the component only when specific state values like `count` or `price` change, you should use `useStore` with a selector.

:::

## Using `useStore` with a selector

`useStore` supports both a `selector` and an `isEqual` argument. The `selector` allows you to choose specific state from the store, so the component will only re-render when the selected state changes. By default, it detects changes using shallow equality. For more control over re-rendering, you can provide a custom equality function via the `isEqual` parameter.

``` tsx
useStore<S, T>(hook: StoreHook<S>, selector: (state: S) => T): T;
useStore<S, T>(hook: StoreHook<S>, selector: (state: S) => T, isEqual: ((current: T, next: T) => boolean)): T;
```

Now, let's use `selector` to optimize the components mentioned above.

``` tsx
import { useStore } from "houp";
import useProduct from "./useProduct";

export function ProductCount() {
    const store = useStore(useProduct, s => ({ count: s.count }));

    return (
        <>
            <div>count: {store.count}</div>
        </>
    );
}

export function ProductPrice() {
    const store = useStore(useProduct, s => ({ price: s.price }));

    return (
        <>
            <div>price: {store.price}</div>
        </>
    );
}

export function Updater() {
    const store = useStore(useProduct);

    return (
        <>
            <button onClick={store.updatePrice}>update price</button>
            <button onClick={() => store.setCount(n => n + 1)}>update count</button>
        </>
    );
}
```