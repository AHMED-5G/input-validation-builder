import {
  TransformAndValidation,
  TransformerInterface,
  Validator,
} from "../src";
import createTransformThenValidate from "../src/createTransformThenValidate";
import createValidation from "../src/createValidation";
import { addValue } from "../src/tests/transformers";
import { numberShouldBe } from "../src/tests/validators";
import {
  validateUsernameWhitespace,
  validateUsernameSpecialCharacters,
  validateUsernameLength,
  validateUsernameLetters,
  englishLettersOnly,
  isRequired,
  isShort,
  removeWhiteSpace,
  toLowerCase,
  addAtForUserName,
  validateHasSpecialCharacters,
} from "./myValidationFunctions";

// const validation = createValidation("eب! ")
//   .validate(validateUsernameWhitespace)

//   .continueWhenError()
//   .validate(validateUsernameSpecialCharacters)
//   .validate(validateUsernameLength)
//   .validate(validateUsernameLetters);
// // console.log("validationPlayground.ts -> ", validation.getErrors());

// const myValidator: Validator<number> = (value) => {
//   if (value !== 6) {
//     return "Value must be == 6";
//   }

//   return null; // No errors
// };

// const myTransformer: TransformerInterface<number, [number]> = (value, arg) => {
//   return value + arg;
// };

// const transformAndValidation = createTransformThenValidate(1)
//   .continueWhenError()
//   .transform(myTransformer, 1)
//   .transform(myTransformer, 1)
//   .transform(myTransformer, 1)
//   .transform(myTransformer, 1)
//   .transform(myTransformer, 1)
//   .validate(myValidator)
//   .validate(myValidator)
//   .validate(myValidator);

// if (transformAndValidation.hasErrors()) {
//   const errors = transformAndValidation.getErrors();
//   console.log("transformAndValidation.hasErrors -> ", errors);
// } else {
//   const transformedValue = transformAndValidation.value;
//   console.log(
//     "validationPlayground.ts -> transformedValue -> ",
//     transformedValue
//   );
// }

const transformAndValidationUserName = createTransformThenValidate<string>(
  "  @AD_5g"
)
  .continueWhenError()
  .transform(removeWhiteSpace)
  .transform(toLowerCase)
  .validate(isRequired)
  .validate(validateHasSpecialCharacters)
  .validate(isShort, 7)
  .callback((validation) => {
    console.log("callback.ts -> ", validation.value);
  })

console.log(
  "validationPlayground.ts -> ",
  transformAndValidationUserName.value
);
console.log(
  "user name valid ?  -> ",
  transformAndValidationUserName.getErrors()
);
const add: TransformerInterface<number, [number]> = (value, num) => {
  return value + num;
};

const numberTransformer = createTransformThenValidate(5).transform(add, 4);
console.log(numberTransformer.value); // 9
