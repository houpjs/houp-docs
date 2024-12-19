`registerStore` let you register a hook as a store. A hook can only be registered once and must be unregistered before it can be registered again.

```tsx
registerStore<S>(hook: StoreHook<S>, provider?: StoreProvider): StoreHook<S>
```

## Parameters

- `hook`: The hook to be registered as a store.
- `provider`: Optional, specifies the provider with which the store will be registered. If not provided, the store will be registered with the global provider.

## Returns

`registerStore` returns the registered hook itself.

## Usage

### Register with the global provider as a global store

``` tsx
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

### Register with a specific provider

If you want to use individual provider, you can use [createProvider](/API%20Reference/Provider#createprovider) to create one.

```tsx
export const LocalProvider = createProvider();
```

``` tsx
import { useCallback, useState } from "react";
import { registerStore } from "houp";
import { LocalProvider } from "./provider";

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

registerStore(useProduct, LocalProvider);
```

### Reuse the same hook logic across different providers

A hook can only be registered once and must be unregistered before it can be registered again. If you want to reuse the hook logic in different providers, you can do it like this.

```tsx
import { useCallback, useState } from "react";
import { registerStore } from "houp";
import { LocalProvider } from "./provider";

function useProduct() {
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

export const useGlobalProduct = registerStore(() => useProduct());
export const useLocalProduct = registerStore(() => useProduct(), LocalProvider);
```

And you can use the store like this.

```tsx
const store = useStore(useGlobalProduct);
```

```tsx
const store = useStore(useLocalProduct);
```

## Troubleshooting

### I got a warning: `The store has already been registered. It appears that registerStore may have been called multiple times with the same provider.`

This usually happens when you register the same hook with the same provider multiple times.

```tsx
registerStore(useProduct);

//....
// and then attempt to register it again in another place.
registerStore(useProduct);
```