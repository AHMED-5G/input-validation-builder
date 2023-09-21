/**
 * Recursive function that increases the value of an object by one.
 * @param value - The initial value of the object.
 * @returns An object with the updated value and a function to increase the value by one.
 */
function testRecursive(value: number) {
  /**
   * Increases the value of the object by one and recursively calls `testRecursive` with the updated value.
   * @returns The result of `testRecursive` with the updated value.
   */
  function increaseValueByOne() {
    object.value += 1;
    return testRecursive(object.value);
  }

  const object = {
    value: value,
  };

  return {
    object,
    increaseValueByOne,
  };
}

const initial = 1;
const result = testRecursive(initial);

console.log(result.object.value); // Output: 1

result.increaseValueByOne();
console.log(result.object.value); // Output: 2

result.increaseValueByOne();
console.log(result.object.value); // Output: 3
