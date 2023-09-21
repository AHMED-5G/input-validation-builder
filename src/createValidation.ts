import { warnMessageWhenErrorCalledWrongIndex } from "./constants";
import { Validation, Validator } from "./types";

export default function createValidation<InputT>(
  value: InputT
): Validation<InputT> {
  const errors: string[] = [];
  let continueAfterFirstError = false;
  let validationCounter = 0;

  function validate<Args extends unknown[]>(
    validator: Validator<InputT, Args>,
    ...args: Args
  ): Validation<InputT> {
    validationCounter++;

    if (!continueAfterFirstError && errors.length > 0) {
      return validation;
    }

    const error = validator(value, ...args);
    if (error) {
      errors.push(error);
    }

    return validation;
  }

  function getErrors(): string[] {
    return errors;
  }

  function hasErrors(): boolean {
    return errors.length > 0;
  }

  function getFirstError(): string | null {
    return errors[0] || null;
  }

  /**
   * It is recommended to call this function as the first validation
   * function or at least at index 1 in the validation chain to ensure
   * that subsequent validators are executed even if there are errors
   * in preceding validators.
   */
  function continueWhenError(): Validation<InputT> {
    if (validationCounter > 1) {
      console.warn(warnMessageWhenErrorCalledWrongIndex);
    }
    continueAfterFirstError = true;
    return validation;
  }

  function callback(
    callback: (validation: Validation<InputT>) => void
  ): Validation<InputT> {
    callback(validation);
    return validation;
  }

  const validation: Validation<InputT> = {
    value,
    errors,
    validate,
    continueWhenError,
    getErrors,
    hasErrors,
    getFirstError,
    callback,
  };
  return validation;
}
