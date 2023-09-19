import { warnMessageWhenErrorCalledWrongIndex } from "./constants";
import ParentFun from "./parentFun";
import {
  TransformAndValidation,
  TransformerInterface,
  Validation,
} from "./types";

export default function createTransformThenValidate<InputT>(
  value: InputT
): TransformAndValidation<InputT> {
  const parent = ParentFun(value);

  // Recursive function to transform the value and perform validation
  function transform<Args extends unknown[]>(
    transformer: TransformerInterface<InputT, Args>,
    ...args: Args
  ): TransformAndValidation<InputT> {
    try {
      const transformedValue = transformer(value, ...args);
      validation.value = transformedValue;

      return createTransformThenValidate(transformedValue);
    } catch (error) {
      parent.errors.push((error as Error).message || "transform error");
      return validation;
    }
  }

  const validation: TransformAndValidation<InputT> & Validation<InputT> = {
    ...parent,
    transform,
  };
  return validation;
}
