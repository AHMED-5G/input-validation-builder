import { Validator } from "../types";

export const hasSpecialCharacter: Validator<string> = (
  value: string,
  message = "Value cannot contain special characters"
) => {
  if (/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
    return message;
  }
  return null;
};

export const isShortText: Validator<string, [number, string?]> = (
  value: string,
  expectedLength: number,
  message = `Value should be at least ${expectedLength} characters long`
): string | null => {
  if (value.length < expectedLength) {
    return message;
  }
  return null;
};

export const numberShouldBe: Validator<number, [number, string?]> = (
  value,
  expectedValue,
  message = `Value should be ${expectedValue}`
) => {
  if (value !== expectedValue) {
    return message;
  }

  return null; // No errors
};
