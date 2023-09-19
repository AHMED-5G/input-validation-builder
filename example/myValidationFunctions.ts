import { Validator } from "../dist";

export const validateHasSpecialCharacters: Validator<string> = (
  text: string,
  message: string = "Special characters not allowed"
) => {
  const specialCharacterRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/;
  return specialCharacterRegex.test(text) ? message : null;
};

export const validateIntNumber: Validator<string> = (
  text: string,
  message = "Enter numeric characters only (Allowed input: 0-9)"
) => {
  const isNumeric = /^[0-9]+$/.test(text);
  return isNumeric ? null : message;
};

export const validateHasWhiteSpace: Validator<string> = (
  text: string,
  message = "White space not allowed"
) => {
  return /\s/g.test(text) ? message : null;
};

export const validateLongTextLength: Validator<string, [number, string?]> = (
  text: string,
  length: number,
  message = "Too long"
) => {
  return text.length > length ? message : null;
};

export function validateShortTextLength(
  text: string,
  length: number,
  message = "Too short"
) {
  return text.length < length ? message : null;
}

export const validateEmail = (
  email: string,
  message = "Invalid email"
): string => {
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const isValidEmail = email.toLowerCase().match(emailRegex);

  return isValidEmail ? "" : message;
};

export const isEnglishWithSpecialChars: Validator<string> = (
  text: string,
  message = "English letters only"
): string => {
  const regex = /^[A-Za-z\s\d~`!@#$%^&*()\-_=+[\]{}|\\;:'",<.>/?]+$/;
  return text.match(regex) ? "" : message;
};


export const validateUsernameWhitespace: Validator<string> = (username: string) => {
  if (/\s/.test(username)) {
    return "Username should not contain whitespace";
  }
  return null;
};

export const validateUsernameSpecialCharacters: Validator<string> = (username) => {
  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    return "Username should not contain special characters";
  }
  return null;
};

export const validateUsernameLength: Validator<string> = (username) => {
  if (username.length < 6) {
    return "Username should be at least 5 characters long";
  }
  return null;
};

export const validateUsernameLetters: Validator<string> = (username) => {
  if (!/^[a-zA-Z]+$/.test(username)) {
    return "Username should only contain English letters";
  }
  return null;
};