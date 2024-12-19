`useStore` is a React hook that returns the state of a registered store.

```tsx
useStore<S>(hook: StoreHook<S>): S;
useStore<S, T>(hook: StoreHook<S>, selector: (state: S) => T): T;
useStore<S, T>(hook: StoreHook<S>, selector: (state: S) => T, isEqual: ((a: T, b: T) => boolean)): T;
```

## Parameters

- `hook`: The hook registered as a store.
- `selector`: A function to select a specific value from the store's state, allowing you to control re-renders for better performance.
- `isEqual`: A function to compare two values and determine equality. If not provided, shallow comparison is used by default.

## Returns

`useStore` returns the state directly if no selector is specified; otherwise, it returns the value produced by the `selector`.

## Usage

```tsx
const state = useStore(useProduct);
```

```tsx
const state = useStore(useProduct, s => ({price: s.price}));
```

## Troubleshooting

### I got a warning: `The store has been unmounted from its Provider. This usually occurs when the Provider is unmounted, and you should avoid using a store that was registered to that Provider.`

This usually happens when you use a local provider in a component, but continue to use the store from that provider after the component has unmounted. For example, if you create a local provider, `LocalProvider`, and register a store with it, you should typically only call `useStore(useProduct)` within the `<Rest />` component. However, if you call useStore in another place, you may encounter this warning after the `Component` is unmounted.

```tsx
export const LocalProvider = createProvider();
```

``` tsx
import { useCallback, useState } from "react";
import { registerStore } from "houp";
import { LocalProvider } from "./provider";

export default function useProduct() {
    return useState(0);
}

registerStore(useProduct, LocalProvider);
```

```tsx
import { LocalProvider } from "./provider";
function Component() {
    return (
        <>
        <LocalProvider />
        <Rest />
        </>
    );
}
```

### I got an error: `Unable to find store. This usually occurs when the Provider is not added to the App or has been unmounted.`

If you are using a global `<Provider />`, it should be added at the top level of the App. If you are using a local provider, it should be placed above all components that use the store within that local provider.

### I got an error: `The store has not been registered yet. Did you forget to call registerStore to register it?`

This usually happens when you call useStore, but the store has not been registered yet.

```tsx
// useProduct has not been registered.
const state = useStore(useProduct);
```