import { useStore } from "houp/lib";
import { useCounter } from "./useCounter";


function Label() {
    const counter = useStore(useCounter);

    return (
        <>
            <div>{counter.count}</div>
        </>
    );
}

function Updater() {
    const counter = useStore(useCounter);

    return (
        <>
            <button onClick={() => counter.setCount(n => n + 1)}>increase</button>
            <button onClick={() => counter.setCount(n => n - 1)}>decrease</button>
        </>
    );
}

export default function Counter() {
    return (
        <>
            <Label />
            <Updater />
        </>
    );
}