import { useState } from "react";

export default function useCount() {
    const [count, setCount] = useState(10);

    return {
        count,
        setCount,
    };
}