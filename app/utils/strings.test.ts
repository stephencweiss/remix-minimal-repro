import { getStringFromForm, isValidString, removeExtraSpaces, removeTextInParentheses, truncateString } from "./strings";

describe("isValidString", () => {
  test("isValidString returns false for null", () => {
    const nullValue = null as unknown as string;
    expect(isValidString(nullValue)).to.be.false
  })
  test("isValidString returns false for empty strings", () => {
    expect(isValidString("")).to.be.false
  })
  test("isValidString returns true for null strings", () => {
    expect(isValidString("null")).to.be.true
  })
  test("isValidString returns true for non-empty strings", () => {
    expect(isValidString("hello")).to.be.true
  })
  test("isValidString returns false for whitespace strings", () => {
    expect(isValidString(" ")).to.be.false
  })
})

describe("removeTextInParentheses", () => {
  test("removeTextInParentheses removes parenthesis and inside text", () => {
    const text = '1/2 (and 1.5 here)'
    expect(removeTextInParentheses(text)).to.equal('1/2 ')
  })
})

describe("removeExtraSpaces", () => {
  test("removeExtraSpaces removes spaces before punctuation", () => {
    const text = ' 1/2  ,  and 2.5 here. '
    expect(removeExtraSpaces(text)).to.equal('1/2, and 2.5 here.')
  }
  )
})

describe("truncateString", () => {
  test("truncateString returns 'No Description' for null", () => {
    const nullValue = null as unknown as string;
    expect(truncateString(nullValue, 10)).to.equal('No Description')
  })
  test("truncateString returns the string if it's shorter than the maxLength", () => {
    expect(truncateString("hello", 10)).to.equal('hello')
  })
  test("truncateString returns the string truncated to the maxLength with an ellipsis if it's longer than the maxLength", () => {
    expect(truncateString("hello world", 5)).to.equal('hello...')
  })
})

describe("getStringFromForm", () => {
  test("getStringFromForm returns the string value of the key", () => {
    const formData = new FormData();
    formData.append("key", "value")
    expect(getStringFromForm(formData, "key")).to.equal("value")
  })
  test("getStringFromForm returns an empty string if the key is not found", () => {
    const formData = new FormData();
    expect(getStringFromForm(formData, "key")).to.equal("")
  })
});