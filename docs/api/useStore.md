---
sidebar_position: 2
---

`useStore` is a React hook that returns the state of a registered store.
It finds the nearest `StoreProvider` in the component tree that contains the specified hook and returns the hook's state from the provider.

```tsx
useStore<S>(hook: StoreHook<S>): S;
useStore<S, T>(hook: StoreHook<S>, selector: (state: S) => T): T;
useStore<S, T>(hook: StoreHook<S>, selector: (state: S) => T, isEqual: ((current: T, next: T) => boolean)): T;
```

## Parameters

- `hook`: The hook registered as a store.
- `selector`: A function to select a specific value from the store's state, allowing you to control re-renders for better performance.
- `isEqual`: A function to compare two values and determine equality. If not provided, shallow comparison is used by default.

## Returns

`useStore` returns the state directly if no selector is specified; otherwise, it returns the value produced by the `selector`.

## Usage

Let's create a `useProduct` hook to use as a store and add the provider at the root of the app.

``` tsx title="useProduct.ts"
import { useState } from "react";

export default function useProduct() {
    const [price, setPrice] = useState(5);
    const [count, setCount] = useState(100);

    return {
        price,
        count,
        setPrice,
        setCount,
    };
}
```

```tsx title="provider.ts"
import useProduct from "./useProduct";
import { createProvider } from "houp";

export const Provider = createProvider([useProduct]);
```

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

### useStore

`useStore` fetches all the data from the `useProduct` store, causing the component to re-render on every state change. To re-render the component only when specific state values like `count` or `price` change, you should use `useStore` with a selector.

``` tsx title="Product.ts"
import { useStore } from "houp";
import useProduct from "./useProduct";

export function Product() {
    const store = useStore(useProduct);

    return (
        <>
            <div>count: {store.count}</div>
        </>
    );
}
```

### Using `useStore` with a selector

`useStore` supports a `selector` argument. The `selector` allows you to choose specific state from the store, so the component will only re-render when the selected state changes. 

``` tsx title="Product.ts"
import { useStore } from "houp";
import useProduct from "./useProduct";

export function Product() {
    const store = useStore(useProduct, s => ({ count: s.count }));

    return (
        <>
            <div>count: {store.count}</div>
        </>
    );
}
```

### Specify your own `isEqual` function

You can also provide your own `isEqual` function to compare two values and determine equality. If not provided, shallow comparison is used by default.

``` tsx title="Product.ts"
import { useStore } from "houp";
import useProduct from "./useProduct";

export function Product() {
    const store = useStore(useProduct, s => ({ count: s.count }), (current, next) => next.count <= 110);

    return (
        <>
            <div>count: {store.count}</div>
        </>
    );
}
```

:::info

This component will only re-render when the count > 110.

:::

## Troubleshooting

### I got an error: `Unable to find store. This usually occurs when the StoreProvider is not added to the App.`

This usually happens when you call `useStore`, but you have not added any provider to the component tree.

```tsx
// cannot find useProduct store in the component tree.
const state = useStore(useProduct);
```

Create a provider with `useProduct` will fix the issue.

```tsx title="provider.ts"
import useProduct from "./useProduct";
import { createProvider } from "houp";

export const Provider = createProvider([useProduct]);
```

```tsx title="index.tsx"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App"
import { Provider } from "./provider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    // highlight-next-line
    <Provider>
      <App />
    // highlight-next-line
    </Provider>
  </StrictMode>,
)
```

### I got an error: `Unable to find store. Did you forget to add it when calling createProvider?`

This usually happens when you call `useStore`, but we cannot find it in the provider.

```tsx
// cannot find useProduct store in the provider.
const state = useStore(useProduct);
```

Make sure to add `useProduct` as a parameter when creating the provider.

```tsx title="provider.ts"
import useProduct from "./useProduct";
import { createProvider } from "houp";

// highlight-next-line
export const Provider = createProvider([useProduct]);
```