import {
  extractGenericDataFromFormData,
  validateEmail,
} from ".";

test("validateEmail returns false for non-emails", () => {
  expect(validateEmail(undefined)).to.be.false;
  expect(validateEmail(null)).to.be.false;
  expect(validateEmail("")).to.be.false;
  expect(validateEmail("not-an-email")).to.be.false;
  expect(validateEmail("n@")).to.be.false;
});

test("validateEmail returns true for emails", () => {
  expect(validateEmail("kody@example.com")).to.be.true;
});

describe("extractGenericDataFromFormData", () => {
  test("returns an array with key and value when pattern matches", () => {
    const formData = new FormData();
    const prefix = "inputName";
    formData.append(`${prefix}[1][id]`, "val-1");
    formData.append(`${prefix}[2][id]`, "val-2");
    const pattern = /inputName\[(\d+)\]\[(\w+)\]/;
    const result = extractGenericDataFromFormData(formData, prefix, pattern);
    expect(result).to.deep.equal([{ id: "val-1" }, { id: "val-2" }]);
  });
});
