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
  .validate(validateUsernameWhitespace)

  .continueWhenError()
  .validate(validateUsernameSpecialCharacters)
  .validate(validateUsernameLength)
  .validate(validateUsernameLetters);
// console.log("validationPlayground.ts -> ", validation.getErrors());

const myValidator: Validator<number> = (value) => {
  if (value !== 6) {
    return "Value must be == 6";
  }

  return null; // No errors
};

const myTransformer: TransformerInterface<number, [number]> = (value, arg) => {
  return value + arg;
};

const transformAndValidation = createTransformThenValidate(1)
  .continueWhenError()
  .transform(myTransformer, 1)
  .transform(myTransformer, 1)
  .transform(myTransformer, 1)
  .transform(myTransformer, 1)
  .transform(myTransformer, 1)
  .validate(myValidator)
  .validate(myValidator)
  .validate(myValidator);

// .transform(myTransformer, 1)

// .transform(myTransformer, 1)

if (transformAndValidation.hasErrors()) {
  const errors = transformAndValidation.getErrors();
  console.log("transformAndValidation.hasErrors -> ", errors);
} else {
  const transformedValue = transformAndValidation.value;
  console.log(
    "validationPlayground.ts -> transformedValue -> ",
    transformedValue
  );
}
