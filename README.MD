![npm](https://img.shields.io/npm/dt/input-validation-builder) ![npm](https://img.shields.io/npm/dw/input-validation-builder)

# Input Validation Builder

Input Validation Builder is a lightweight library for validating input values. It provides a simple and flexible way to perform various validations on input values, such as checking for required fields, validating email addresses, and more.

## Usage

Input Validation Builder provides a convenient way to build validation chains. You can use it to perform single or multiple validations on input values and retrieve any validation errors that occur.

## Installation

Install the package using npm:

```bash
 npm install input-validation-builder
```

or

```bash
bun install input-validation-builder
```

## `Validation` Interface

The `Validation` interface represents a validation object that holds the input value, validation errors, and provides methods for performing validations and retrieving error information.

| Method                                                                                                    | Description                                                                                                                                                                                                                                 |
| --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `validate<Args extends unknown[]>(validator: Validator<InputT, Args>, ...args: Args): Validation<InputT>` | Performs a validation using a validator function and optional arguments. Returns a new `Validation` object.                                                                                                                                 |
| `getErrors(): string[]`                                                                                   | Returns an array of all validation error messages.                                                                                                                                                                                          |
| `hasErrors(): boolean`                                                                                    | Returns `true` if there are any validation errors, and `false` otherwise.                                                                                                                                                                   |
| `getFirstError(): string \| null`                                                                         | Returns the first validation error message, or `null` if there are no errors.                                                                                                                                                               |
| `continueWhenError(): Validation<InputT>`                                                                 | Configures the validation to continue even if there are validation errors. Returns a new Validation object. By default, the validation stops when the first error is found. This method should be called before performing any validations. |

The `Validation` interface provides a powerful and flexible way to define and perform validations on input values, as well as retrieve and handle validation errors.

## Example-simple

Here's an example of how you can use the Validation Builder to perform a single validation:

```ts
import { createValidation } from "input-validation-builder";

const value = "example";
const validation = createValidation(value);

function isRequired(value: string): string | null {
  if (!value) {
    return "Value is required";
  }
  return null;
}

function isEmail(value: string): string | null {
  if (!/^\S+@\S+\.\S+$/.test(value)) {
    return "Invalid email address";
  }
  return null;
}

validation.validate(isRequired); // Perform the first validation
validation.validate(isEmail); // Perform the second validation

const errors = validation.getErrors(); // Get the list of errors

if (validation.hasErrors()) {
  console.log("Validation errors:", errors);
} else {
  console.log("Validation passed");
}
```

This will output:

Validation errors: ["Invalid email address"]

## Example: Performing Multiple Validations Chain

Here's an example of how you can use the Validation Library Multiple Validations chain:

```ts
import { createValidation } from "input-validation-builder";

const value = "example";
const validation = createValidation(value)
  .continueWhenError()
  .validate(isRequired)
  .validate(isEmail)
  .validate(isShortText, 5);

function isRequired(value: string): string | null {
  if (!value) {
    return "Value is required";
  }
  return null;
}

function isEmail(value: string): string | null {
  if (!/^\S+@\S+\.\S+$/.test(value)) {
    return "Invalid email address";
  }
  return null;
}

function isShortText(value: string, expectedLength: number): string | null {
  if (value.length < expectedLength) {
    return `Value should be at least ${expectedLength} characters long`;
  }
  return null;
}

const errors = validation.getErrors(); // Get the list of errors

if (validation.hasErrors()) {
  console.log("Validation errors:", errors);
} else {
  console.log("Validation passed");
}
```

## Validator Function Type

The `Validator` function type represents a validator function that accepts an input value and optional arguments. It returns a string indicating an error message if validation fails, or null if validation succeeds.

```ts
type Validator<InputT, Args extends unknown[] = [string?]
= ( value: InputT, ...args: Args ) => string | null;
```

### example (input , message)

when you only have a single additional parameter (in this case, message) after the input parameter (text), you don't need to explicitly define the type because it's already defined in the Validator type.

```ts
import { Validator } from "input-validation-builder";

const hasWhiteSpace: Validator<string> = (
  text: string,
  message = "White space not allowed"
) => {
  return /\s/g.test(text) ? message : null;
};
```

### example (input , number , message)

You only need to define the type when you have more than two parameters.

```ts
import { Validator } from "input-validation-builder";

const validateLongTextLength: Validator<string, [number, string?]> = (
  text,
  length,
  message = "Too long"
) => {
  return text.length > length ? message : null;
};
```

## Custom Error Message example

you can pass all the arguments through the validate function, including the custom error message. Here's an example:

```ts
import { Validator } from "input-validation-builder";

const validateLongTextLength: Validator<string, [number, string?]> = (
  text,
  length,
  message = "Too long"
) => {
  return text.length > length ? message : null;
};

const text = "This is a long text";
const maxLength = 10;
const customMessage = "Exceeded maximum length";

const result1 = validateLongTextLength(text, maxLength); // Uses default error message
const result2 = validateLongTextLength(text, maxLength, customMessage); // Overrides the error message

console.log(result1); // "Too long"
console.log(result2); // "Exceeded maximum length"
```
