![npm](https://img.shields.io/npm/dt/input-validation-builder) ![npm](https://img.shields.io/npm/dw/input-validation-builder)

# Input Validation Builder

Input Validation Builder is a lightweight library for validating input values. It provides a simple and flexible way to perform various validations on input values, such as checking for required fields, validating email addresses, and more.

## Table of Contents

- [Validation Interface](#validation-interface)
- [Validation Example simple](#Validation-Example-simple)
- [Example: Performing Multiple Validations Chain](#Example:-Performing-Multiple-Validations-Chain)
- [Validator Function Type](#Validator-Function-Type)
- [Transform Then Validate](#Transform-Then-Validate)
- [Create Transform Then Validate function](#Create-Transform-Then-Validate-function)
- [Create Transform Then Validate Example](#Create-Transform-Then-Validate-example)

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
| `callback: (validation: Validation) => void`                                                              | method is a callback function that is can be called after the validation process is complete to perform additional actions, such as saving the input value to a database .                                                                  |

The `Validation` interface provides a powerful and flexible way to define and perform validations on input values, as well as retrieve and handle validation errors.

## Validation Example simple

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

## Transform Then Validate

### Transformer interface

#### examples

The TransformerInterface is a type definition in TypeScript that defines a function that takes an input value of type InputT and an optional array of arguments of type Args and returns an output value of type InputT. Here's the definition of the TransformerInterface:

```ts
export type TransformerInterface<InputT, Args extends unknown[] = []> = (
  value: InputT,
  ...args: Args
) => InputT;
```

##### add

Here's an example of how you can use the TransformerInterface to define a function that adds two numbers:

```ts
import { TransformerInterface } from "input-validation-builder";
const add: TransformerInterface<number, [number]> = (value, num) => {
  return value + num;
};

const numberTransformer = createTransformThenValidate(5).transform(add, 4);
console.log(numberTransformer.value); // 9
```

##### toLowerCase

Here's an example of how you can use the createTransformThenValidate function to transform a string to lowercase:

```ts
import {
  TransformerInterface,
  createTransformThenValidate,
} from "input-validation-builder";

const toLowerCase: TransformerInterface<string> = (value: string) => {
  return value.toLowerCase();
};

const helloTransformer =
  createTransformThenValidate("HELLO").transform(toLowerCase);

console.log(helloTransformer.value); // "hello"
```

You can use the TransformerInterface to define functions that transform input values in a flexible and type-safe way.

### Create Transform Then Validate function

`createTransformThenValidate` is a function that allows you to create a chain of transformations and validations for a given input value. The function returns a TransformAndValidation object that provides methods for performing transformations and validations on the input value. Here's an overview of how the `createTransformThenValidate` function works:

- The function takes an input value as its argument.
  It creates a new `TransformAndValidation` object with the input value as its initial value.

- The `TransformAndValidation` object provides methods for performing transformations and validations on the input value.

- The transform method takes a transformer function as its argument and applies the transformation to the input value.

- The validate method takes a validator function as its argument and applies the validation to the input value.

- The `continueWhenError` method sets a flag that allows the validation process to continue even if an error is encountered.

- The `getErrors` method returns an array of error messages generated during the validation process.

- The `hasErrors` method returns a boolean value indicating whether any errors were generated during the validation process.

- The `getFirstError` method returns the first error message generated during the validation process.

- The `callback` method is a callback function that is can be called after the validation process is complete to perform additional actions, such as saving the input value to a database .

Here's an example of how you can use the `createTransformThenValidate` function to transform and validate a string input value:

### Create Transform Then Validate Example

```ts
import { TransformerInterface } from "input-validation-builder";
import createTransformThenValidate, {
  Validator,
} from "input-validation-builder";
import {
  removeWhiteSpace,
  toLowerCase,
  isRequired,
  HasSpecialCharacters,
  isShort,
} from "./utils";

const transformAndValidationUserName = createTransformThenValidate("  @AD_5g")
  .transform(removeWhiteSpace)
  .transform(toLowerCase)
  .continueWhenError()
  .validate(isRequired)
  .validate(HasSpecialCharacters)
  .validate(isShort, 7);

console.log(transformAndValidationUserName.value); // "@ad_5g"
console.log(transformAndValidationUserName.getErrors()); // [ "Special characters not allowed", "Value should be at least 7 characters long"]
```

### callback method example

Here's an example of how to use the callback method in the TransformAndValidation function:

```ts
import {
  TransformerInterface,
  createTransformThenValidate,
  Validator,
} from "input-validation-builder";

import { toLowerCase, isRequired } from "./utils";

const transformAndValidation = createTransformAndValidate("HELLO")
  .transform(toLowerCase)
  .validate(isRequired)
  .callback((validation) => {
    if (validation.hasErrors()) {
      console.log(validation.getErrors());
    } else {
      console.log(validation.value);
    }
  });
```
