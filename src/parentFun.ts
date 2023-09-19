import { warnMessageWhenErrorCalledWrongIndex } from "./constants";
import {  ValidationAbstract, Validator } from "./types";

export default function ParentFun<InputT>(value: InputT): ValidationAbstract<InputT> {
  const errors: string[] = [];
  let continueAfterFirstError = false;
  let validationCounter = 0;

  function validate<Args extends unknown[]>(
    validator: Validator<InputT, Args>,
    ...args: Args
  ): ValidationAbstract<InputT> {
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
  function continueWhenError(): ValidationAbstract<InputT> {
    if (validationCounter > 1) {
      console.warn(warnMessageWhenErrorCalledWrongIndex);
    }
    continueAfterFirstError = true;
    return validation;
  }

  const validation: ValidationAbstract<InputT> = {
    value,
    errors,
    validate,
    getErrors,
    getFirstError,
    hasErrors,
    continueWhenError,
  };

  return validation;
}
