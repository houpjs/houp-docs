import useCount from "./useCount";
import usePrice from "./usePrice";
import { createProvider } from "houp/lib";

export const Provider = createProvider([useCount, usePrice]);