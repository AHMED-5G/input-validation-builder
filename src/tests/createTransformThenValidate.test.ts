import assert from "assert";
import { warnMessageWhenErrorCalledWrongIndex } from "../constants";
import { hasSpecialCharacter, isShortText, numberShouldBe } from "./validators";
import { addValue, toUpperCase } from "./transformers";
import createTransformThenValidate from "../createTransformThenValidate";

describe("createValidation", () => {
  // Test case for a valid value
  it("should validate a valid value", () => {
    const value = "Hello World";

    const validation =
      createTransformThenValidate(value).validate(hasSpecialCharacter);

    expect(validation.hasErrors()).toBe(false);
  });

  // Test case for an invalid value
  it("should validate an invalid value", () => {
    const value = "Hello, World!123";

    const validation =
      createTransformThenValidate(value).validate(hasSpecialCharacter);

    expect(validation.hasErrors()).toBe(true);
    assert.deepEqual(validation.getErrors(), [
      "Value cannot contain special characters",
    ]);
  });

  // Test case for an multiple validators
  it("should validate multiple validators", () => {
    const value = "Hello, World!123";

    const validation = createTransformThenValidate(value)
      .continueWhenError()
      .validate(hasSpecialCharacter)
      .validate(hasSpecialCharacter)
      .validate(hasSpecialCharacter);

    expect(validation.hasErrors()).toBe(true);
    assert.deepEqual(validation.getErrors(), [
      "Value cannot contain special characters",
      "Value cannot contain special characters",
      "Value cannot contain special characters",
    ]);
  });

  // Test case for an getFirstError method
  it("method getFirstError should return the only first error", () => {
    const value = "Hello, World!123";

    const validation = createTransformThenValidate(value)
      .continueWhenError()
      .validate(hasSpecialCharacter, "this Message")
      .validate(hasSpecialCharacter, "Error message")
      .validate(hasSpecialCharacter, "Error message");

    expect(validation.hasErrors()).toBe(true);
    assert.deepEqual(validation.getFirstError(), "this Message");
  });

  // Test case for a continueWhenError method
  it("Should not continue and return first error if continueWhenError is not called", () => {
    const value = "Hello, World!123";

    const validation = createTransformThenValidate(value)
      .validate(hasSpecialCharacter, "this Message")
      .validate(hasSpecialCharacter, "Error message")
      .validate(hasSpecialCharacter, "Error message");

    expect(validation.hasErrors()).toBe(true);
    assert.deepEqual(validation.getErrors(), ["this Message"]);
  });

  // Test case for its console.warn when call a continueWhenError method in index > 1
  it("Should fire console.warn when call a continueWhenError method in index > 1", () => {
    const value = "Hello, World!123";
    const warnMock = jest.spyOn(console, "warn");
    createTransformThenValidate(value)
      .validate(hasSpecialCharacter)
      .validate(hasSpecialCharacter)
      .validate(hasSpecialCharacter)
      .continueWhenError();

    // Check if the test is running in the "prepublish" script
    const isPrepublish = process.argv.includes("prepublish");

    if (!isPrepublish) {
      expect(warnMock).toHaveBeenCalledWith(
        warnMessageWhenErrorCalledWrongIndex
      );
    }
    warnMock.mockRestore();
  });

  it("should create a new TransformAndValidation object with the initial value", () => {
    const value = "example";
    const transformAndValidation = createTransformThenValidate(value);

    expect(transformAndValidation.value).toBe(value);
    expect(transformAndValidation.errors).toEqual([]);
  });

  it("should transform the value and perform validation", () => {
    const value = "example";
    const transformAndValidation = createTransformThenValidate(value);

    const transformedValue =
      transformAndValidation.transform(toUpperCase).value;
    const validation = transformAndValidation.validate(isShortText, 5);

    expect(transformedValue).toBe("EXAMPLE");
    expect(validation.getErrors()).toEqual([]);
  });

  it("should create a new TransformAndValidation object with the initial value", () => {
    const value = 1;
    const transformAndValidation = createTransformThenValidate(value);

    expect(transformAndValidation.value).toBe(value);
    expect(transformAndValidation.errors).toEqual([]);
  });

  it("continue when error method can has effect when placed before transformer", () => {
    const value = 1;
    const errorMessage = "Value should be 6";
    const transformAndValidation = createTransformThenValidate(value)
      .continueWhenError()
      .transform(addValue, 1)
      .transform(addValue, 1)
      .validate(numberShouldBe, 6, errorMessage)
      .validate(numberShouldBe, 6, errorMessage)
      .validate(numberShouldBe, 6, errorMessage);

    expect(transformAndValidation.getErrors()).toEqual([
      errorMessage,
      errorMessage,
      errorMessage,
    ]);
  });

  it("it can get first error", () => {
    const transformAndValidation = createTransformThenValidate(1)
      .continueWhenError()
      .transform(addValue, 1)
      .validate(numberShouldBe, 111, "this error")
      .validate(numberShouldBe, 111, "ss");

    expect(transformAndValidation.getErrors().length).toBe(2);
    expect(transformAndValidation.getFirstError()).toEqual("this error");
  });

  it("should invoke the callback function", () => {
    // Arrange

    const callback = jest.fn();

    // Act
    const result = createTransformThenValidate(5)
      .validate(numberShouldBe, 6)
      .callback(callback);

    // Assert
    expect(callback).toHaveBeenCalledWith(result);
  });

  it("can get validation object on callback", () => {
    const transformAndValidation = createTransformThenValidate(1)
      .continueWhenError()
      .transform(addValue, 1)
      .validate(numberShouldBe, 6, "thisError")
      .callback((validation) => {
        expect(validation.getErrors()).toEqual(["thisError"]);
      });
  });
});
