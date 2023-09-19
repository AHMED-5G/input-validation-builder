import { TransformerInterface, Validator } from "../src";
import createTransformAndValidate from "../src/createTransformAndValidate";
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

const value = 1; // The input value

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
  // Transformation logic
  return value + arg;
};

const transformAndValidation = createTransformAndValidate(1)
  .transform(myTransformer, 7)
  .transform(myTransformer, 1)
  .validate(myValidator)
  .validate(myValidator)
  .validate(myValidator)
  .validate(myValidator);

if (transformAndValidation.hasErrors()) {
  const errors = transformAndValidation.getErrors();


} else {
  const transformedValue = transformAndValidation.value;
  console.log(
    "validationPlayground.ts -> transformedValue -> ",
    transformedValue
  );
  // Use the transformed value
}
