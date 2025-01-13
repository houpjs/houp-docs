import { useState } from "react";

export default function usePrice() {
    const [price, setPrice] = useState(5);

    return {
        price,
        setPrice,
    };
}