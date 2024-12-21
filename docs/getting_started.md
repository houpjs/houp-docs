---
slug: /
sidebar_position: 1
sidebar_label: Getting Started
title: Getting Started
---

Houp(hook up) is a simple, fast, and reliable solution for sharing state across multiple components. Whether you're working on a new project or an existing one, integrating Houp is straightforward. It doesn't matter how the state is created or managed — Houp focuses solely on sharing it.

## Installation

```
npm install houp
```

## Play in Codesandbox

[![Edit infallible-villani-89k5vf](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/sandbox/infallible-villani-89k5vf)

## Add `<Provider />`

Add `<Provider />` at the top of your App. `<Provider />` is a regular function component, not a Context Provider, so it doesn't need to wrap the App. This means that `<Provider />` and the App will not affect each other. However, it's important to render it before any component that uses `useStore`, which is why it should be placed above the App.

``` tsx
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.tsx"
import { Provider } from "houp"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider />
    <App />
  </StrictMode>,
)

```

## Register a store

Any React Hook can be registered as a store and shared across components.

``` tsx
// useProduct.js
import { useCallback, useState } from "react";
import { registerStore } from "houp";

export default function useProduct() {
    const [price, setPrice] = useState(5);
    const [count, setCount] = useState(100);

    const updatePrice = useCallback(async () => {
        // await fetch(...)
        setPrice(n => n + 1);
    }, []);

    return {
        price,
        count,
        updatePrice,
        setCount,
    };
}

registerStore(useProduct);
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

> You may have noticed that the `ProductCount` component re-renders even when you click the `update price` button. This happens because `useStore` fetches all the data from the store, causing the component to re-render on every state change. To re-render the component only when specific state values like `count` or `price` change, you should use `useStore` with a selector.

## Using `useStore` with a selector

`useStore` supports both a `selector` and an `isEqual` argument. The `selector` allows you to choose specific state from the store, so the component will only re-render when the selected state changes. By default, it detects changes using shallow equality. For more control over re-rendering, you can provide a custom equality function via the `isEqual` parameter.

``` tsx
useStore(hook, selector?, isEqual?);
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