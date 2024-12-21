---
sidebar_position: 2
---

`registerStore` let you register a hook as a store, either in the global namespace or a specified namespace. A hook can only be registered once and must be unregistered before it can be registered again.

```tsx
registerStore<S>(hook: StoreHook<S>, namespace?: string): StoreHook<S>
```

## Parameters

- `hook`: The hook to be registered as a store.
- `namespace`: Optional, specifies the namespace under which the store will be registered. If omitted, the store will be registered in the global namespace.

## Returns

`registerStore` returns the registered hook itself.

## Usage

### Register to global namespace

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

### Register to a specified namespace

If you want to use namespaced provider, you can set `namespace` prop to the `<Provider />`.

```tsx
<Provider namespace="test" />
```

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

registerStore(useProduct, "test");
```

### Reuse the same hook logic across different namespace

A hook can only be registered once and must be unregistered before it can be registered again. If you want to reuse the hook logic in different namespace, you can do it like this.

```tsx
import { useCallback, useState } from "react";
import { registerStore } from "houp";

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
export const useLocalProduct = registerStore(() => useProduct(), "local");
```

And you can use the store like this.

```tsx
const store = useStore(useGlobalProduct);
```

```tsx
const store = useStore(useLocalProduct);
```

## Troubleshooting

### I got a warning: `The store is already registered. This usually occurs when the same hook is registered in different namespaces simultaneously.`

As the warning indicates, you might register the same hook in different namespaces simultaneously.

```tsx
registerStore(useProduct);

//....

// And then attempt to register it with another namespaced provider elsewhere.
registerStore(useProduct, namespace);
```