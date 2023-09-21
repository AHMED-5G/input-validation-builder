import { TransformerInterface } from "../types";

export const toUpperCase: TransformerInterface<string> = (value: string) => {
  return value.toUpperCase();
};

export const addValue: TransformerInterface<number, [number]> = (
  value,
  arg
) => {
  return value + arg;
};
