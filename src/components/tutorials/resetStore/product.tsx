import { useProvider, useStore } from "houp/lib";
import useCount from "./useCount";
import usePrice from "./usePrice";


function Label() {
    const countStore = useStore(useCount);
    const priceStore = useStore(usePrice);

    return (
        <>
            <div>Count: {countStore.count}</div>
            <div>Price: {priceStore.price}</div>
        </>
    );
}

function Updater() {
    const countStore = useStore(useCount);
    const priceStore = useStore(usePrice);
    const provider = useProvider(useCount);
    // const provider = useProvider(usePrice);

    return (
        <>
            <button onClick={() => countStore.setCount(n => n + 1)}>count+1</button>
            <button onClick={() => countStore.setCount(n => n - 1)}>count-1</button>
            <button onClick={() => provider.resetStore(useCount)}>reset count</button>
            <button onClick={() => priceStore.setPrice(n => n + 1)}>price+1</button>
            <button onClick={() => priceStore.setPrice(n => n - 1)}>price-1</button>
            <button onClick={() => provider.resetStore(usePrice)}>reset price</button>
            <button onClick={() => provider.resetAllStore()}>reset all</button>
        </>
    );
}

export default function Product() {
    return (
        <>
            <Label />
            <Updater />
        </>
    );
}