/**
 * Validator function type that accepts an input value and optional arguments.
 * The return value can be a string indicating an error message, or null if validation succeeds.
 * @explanation
 * The default value of [string] for Args simplifies the usage of the Validator type.
 * It allows most validator functions to work with just the value and message parameters without explicitly providing the type argument for Args.
 * This default value is beneficial when defining validators that commonly require only the value and message parameters.
 */
export type Validator<InputT, Args extends unknown[] = [string?]> = (
  value: InputT,
  ...args: Args
) => string | null;

export type TransformerInterface<InputT, Args extends unknown[]> = (
  value: InputT,
  ...args: Args
) => InputT;

export interface ValidationAbstract<InputT> {
  value: InputT;

  /**

  to run validate().transform() u should return instance of TransformAndValidation<InputT>
    */
  validate<Args extends unknown[]>(
    validator: Validator<InputT, Args>,
    ...args: Args
  ): ValidationAbstract<InputT>;
  errors: string[];
  getErrors(): string[];
  hasErrors(): boolean;
  getFirstError(): string | null;
  continueWhenError(): ValidationAbstract<InputT>;
}

export interface Validation<InputT> extends ValidationAbstract<InputT> {}

export interface TransformAndValidation<InputT>
  extends ValidationAbstract<InputT> {
  transform<Args extends unknown[]>(
    transformer: TransformerInterface<InputT, Args>,
    ...args: Args
  ): TransformAndValidation<InputT>;
}
