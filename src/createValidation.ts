import { warnMessageWhenErrorCalledWrongIndex } from "./constants";
import ParentFun from "./parentFun";
import { Validation, Validator } from "./types";

export default function createValidation<InputT>(
  value: InputT
): Validation<InputT> {

  const parent = ParentFun(value);
  const validation:  Validation<InputT> = {
    ...parent,
  };
  return validation;
}
