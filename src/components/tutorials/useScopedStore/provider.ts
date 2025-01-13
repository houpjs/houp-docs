import { createProvider } from "houp/lib";
import { useCounter } from "./useCounter";


export const Provider = createProvider([useCounter]);