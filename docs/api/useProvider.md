---
sidebar_position: 3
---

`useProvider` is a React hook that helps find the nearest `StoreProvider` that contains the specified hook in the component tree and returns a `Provider` object for managing the store within the provider.

```tsx
useProvider(hook: StoreHook): Provider
```

## Parameters

- `hook`: A hook that can be used as a store.

## Returns

```tsx
type Provider = {
    resetStore<S>(hook: StoreHook<S>): void;
    resetAllStore(): void;
}

```

## Usage

### Create some hooks

``` tsx title="useCount.ts"
import { useState } from "react";

export default function useCount() {
    const [count, setCount] = useState(0);

    return {
        count,
        setCount,
    };
}
```

``` tsx title="usePrice.ts"
import { useState } from "react";

export default function usePrice() {
    const [price, setPrice] = useState(0);

    return {
        price,
        setPrice,
    };
}
```

### Add the provider at the root of the app

```tsx title="provider.ts"
import useCount from "./useCount";
import usePrice from "./useCount";
import { createProvider } from "houp";

export const Provider = createProvider([useCount, usePrice]);
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

### Reset a specific store in the provider

In this sample, the count will increase when the `increase` button is clicked, and it will reset to 0 when the `reset` button is clicked.

``` tsx title="component.tsx"
import { useStore } from "houp";
import useCount from "./useCount";

export function Component() {
    const store = useStore(useCount);

    return (
        <>
            <div>count: {store.count}</div>
            <button onClick={() => store.setCount(n => n + 1)}>increase</button>
        </>
    );
}
```

``` tsx title="resetButton.tsx"
import { useProvider } from "houp";
import useCount from "./useCount";

export function ResetButton() {
    const provider = useProvider(useCount);

    return (
        <>
            <button onClick={() => provider.resetStore(useCount)}>reset</button>
        </>
    );
}
```

### Reset all store in the provider

In this sample, the count will increase when the `increase count` button is clicked, the price will increase when the `increase price` button is clicked, and both count and price will reset to 0 when the `reset all` button is clicked.

``` tsx title="countComponent.tsx"
import { useStore } from "houp";
import useCount from "./useCount";

export function CountComponent() {
    const store = useStore(useCount);

    return (
        <>
            <div>count: {store.count}</div>
            <button onClick={() => store.setCount(n => n + 1)}>increase count</button>
        </>
    );
}
```

``` tsx title="priceComponent.tsx"
import { useStore } from "houp";
import usePrice from "./usePrice";

export function PriceComponent() {
    const store = useStore(usePrice);

    return (
        <>
            <div>price: {store.price}</div>
            <button onClick={() => store.setPrice(n => n + 1)}>increase price</button>
        </>
    );
}
```

``` tsx title="resetAllButton.tsx"
import { useProvider } from "houp";
import useCount from "./useCount";

export function ResetAllButton() {
    const provider = useProvider(useCount);
    // const provider = useProvider(usePrice);

    return (
        <>
            <button onClick={() => provider.resetAllStore()}>reset all</button>
        </>
    );
}
```

:::info

`useProvider(useCount)` and `useProvider(usePrice)` will return the same `Provider` object because they are within the same provider.

:::