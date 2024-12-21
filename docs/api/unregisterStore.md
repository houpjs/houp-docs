---
sidebar_position: 4
---

`unregisterStore` is used to unregister a hook from the store. While it's not usually necessary to unregister a hook, if it's used temporarily, you may need to do so to avoid conflicts, as a hook can only be registered once and must be unregistered before it can be registered again.

```tsx
unregisterStore(hook: StoreHook): void
```

## Parameters

- `hook`: The hook to be unregistered.

> **NOTE**: Before unregistering a store, ensure that no other part of the application is using it, as this may cause unexpected behavior.