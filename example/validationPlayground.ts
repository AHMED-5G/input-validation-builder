import { TransformerInterface, Validator } from "../src";
import createTransformThenValidate from "../src/createTransformThenValidate";

import createValidation from "../src/createValidation";
import {
  validateUsernameWhitespace,
  validateUsernameSpecialCharacters,
  validateUsernameLength,
  validateUsernameLetters,
} from "./myValidationFunctions";

const validation = createValidation("eب! ")
  .continueWhenError()
  .validate(validateUsernameWhitespace)
  .validate(validateUsernameSpecialCharacters)
  .validate(validateUsernameLength)
  .validate(validateUsernameLetters);

// console.log("validationPlayground.ts -> ", validation.getErrors());

const myValidator: Validator<number> = (value) => {
  console.log("validationPlayground.ts -> value in validator ", value);
  // Validation logic
  if (value !== 6) {
    return "Value must be == 6";
  }

  return null; // No errors
};

const myTransformer: TransformerInterface<number, [number]> = (value, arg) => {
  console.log("validationPlayground.myTransformer -> ", value, arg);

  return value + arg;
};

const transformAndValidation = createTransformThenValidate(1)
.transform(myTransformer, 4)
.validate(myValidator)

  // .transform(myTransformer, 1)

if (transformAndValidation.hasErrors()) {
  const errors = transformAndValidation.getErrors();
  console.log("validationPlayground.ts -> hasErrors -> ", errors);
} else {
  const transformedValue = transformAndValidation.value;
  console.log(
    "validationPlayground.ts -> transformedValue -> ",
    transformedValue
  );
}
