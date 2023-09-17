import { Validator } from "../src";
import createValidation from "../src/createValidation";

const value = "eب! ";

const validateUsernameWhitespace: Validator<string> = (username: string) => {
  if (/\s/.test(username)) {
    return "Username should not contain whitespace";
  }
  return null;
};

const validateUsernameSpecialCharacters: Validator<string> = (username) => {
  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    return "Username should not contain special characters";
  }
  return null;
};

const validateUsernameLength: Validator<string> = (username) => {
  if (username.length < 6) {
    return "Username should be at least 5 characters long";
  }
  return null;
};

const validateUsernameLetters: Validator<string> = (username) => {
  if (!/^[a-zA-Z]+$/.test(username)) {
    return "Username should only contain English letters";
  }
  return null;
};

const validation = createValidation(value)
  .continueWhenError()
  .validate(validateUsernameWhitespace)
  .validate(validateUsernameSpecialCharacters)
  .validate(validateUsernameLength)
  .validate(validateUsernameLetters);

console.log("validationPlayground.ts -> ", validation.getErrors());
