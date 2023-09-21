import assert from "assert";
import { warnMessageWhenErrorCalledWrongIndex } from "../constants";
import createValidation from "../createValidation";
import { hasSpecialCharacter, numberShouldBe } from "./validators";

describe("createValidation", () => {
  // Test case for a valid value
  it("should validate a valid value", () => {
    const value = "Hello World";

    const validation = createValidation(value).validate(hasSpecialCharacter);

    expect(validation.hasErrors()).toBe(false);
  });

  // Test case for an invalid value
  it("should validate an invalid value", () => {
    const value = "Hello, World!123";

    const validation = createValidation(value).validate(hasSpecialCharacter);

    expect(validation.hasErrors()).toBe(true);
    assert.deepEqual(validation.getErrors(), [
      "Value cannot contain special characters",
    ]);
  });

  // Test case for an multiple validators
  it("should validate multiple validators", () => {
    const value = "Hello, World!123";

    const validation = createValidation(value)
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

    const validation = createValidation(value)
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

    const validation = createValidation(value)
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
    createValidation(value)
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

  it("should invoke the callback function", () => {

    const callback = jest.fn();

    // Act
    const result = createValidation(5)
      .validate(numberShouldBe, 6)
      .callback(callback);

    // Assert
    expect(callback).toHaveBeenCalledWith(result);
  });

  it("can get validation object on callback", () => {
    const transformAndValidation = createValidation(1)
      .validate(numberShouldBe, 6, "thisError")
      .callback((validation) => {
        expect(validation.getErrors()).toEqual(["thisError"]);
      });
  });
});
