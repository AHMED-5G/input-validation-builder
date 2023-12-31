import { warnMessageWhenErrorCalledWrongIndex } from "./constants";
import {
  TransformAndValidation,
  TransformerInterface,
  Validator,
} from "./types";

export default function createTransformThenValidate<InputT>(
  value: InputT
): TransformAndValidation<InputT> {
  let errors: string[] = [];
  let settings = {
    continueAfterFirstError: false,
  };

  let validationCounter = 0;

  function validate<Args extends unknown[]>(
    validator: Validator<InputT, Args>,
    ...args: Args
  ): TransformAndValidation<InputT> {
    validationCounter++;

    if (!settings.continueAfterFirstError && errors.length > 0) {
      return validation;
    }

    const error = validator(value, ...args);
    if (error) {
      errors.push(error);
    }
    validation.errors = errors;
    return validation;
  }

  function getErrors(): string[] {
    return errors;
  }

  function hasErrors(): boolean {
    return validation.errors.length > 0 || errors.length > 0;
  }

  function getFirstError(): string | null {
    return errors[0] || validation.errors[0] || null;
  }

  // Recursive function to transform the value and perform validation
  function transform<Args extends unknown[]>(
    transformer: TransformerInterface<InputT, Args>,
    ...args: Args
  ): TransformAndValidation<InputT> {
    try {
      const transformedValue = transformer(value, ...args);
      const transformedValidation =
        createTransformThenValidate(transformedValue);
      transformedValidation.settings.continueAfterFirstError =
        settings.continueAfterFirstError;

      return transformedValidation;
    } catch (error) {
      console.warn((error as Error).message);
      errors.push((error as Error).message || "transform error");

      return validation;
    }
  }

  function continueWhenError(): TransformAndValidation<InputT> {
    if (validationCounter > 1) {
      console.warn(warnMessageWhenErrorCalledWrongIndex);
    }

    settings.continueAfterFirstError = true;
    return validation;
  }

  function callback(
    callback: (validation: TransformAndValidation<InputT>) => void
  ): TransformAndValidation<InputT> {
    callback(validation);
    return validation;
  }

  const validation: TransformAndValidation<InputT> = {
    value,
    errors,
    validate,
    transform,
    continueWhenError,
    getErrors,
    hasErrors,
    getFirstError,
    settings,
    callback,
  };
  return validation;
}
