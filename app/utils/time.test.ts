import { _testing } from "./time";

const { parseISO8601Duration } = _testing;
describe("parseISO8601Duration", () => {
  const emptyTime = {
    years: null,
    months: null,
    days: null,
    hours: null,
    minutes: null,
    seconds: null,
  };
  test("parseISO8601Duration handles null", () => {
    expect(parseISO8601Duration(null)).to.deep.equal(emptyTime)
  })
  test("parseISO8601Duration handles empty strings", () => {
    expect(parseISO8601Duration("")).to.deep.equal(emptyTime)
  })
  test("parseISO8601Duration handles null strings", () => {
    expect(parseISO8601Duration("null")).to.deep.equal(emptyTime)
  })
  test("parseISO8601Duration handles well formed 8601Duration strings", () => {
    expect(parseISO8601Duration("PT1H30M")).to.deep.equal({
      days: 0,
      hours: 1,
      minutes: 30,
      months: 0,
      seconds: 0,
      years: 0,
    })
  })
  test("parseISO8601Duration throws on malformed 8601Duration strings", () => {
    expect(() => parseISO8601Duration("PT1h30m")).to.throw("Invalid ISO8601 Duration")
  })
});

describe("isValidISO8601Duration", () => {
  it("returns true for valid durations", () => {
    expect(_testing.isValidISO8601Duration("PT1H30M")).to.be.true
  })
  it("returns false for invalid durations", () => {
    expect(_testing.isValidISO8601Duration("PT1h30m")).to.be.false
  })
})

describe("throwIfInvalidDuration", () => {
  it("throws for invalid durations", () => {
    expect(() => _testing.throwIfInvalidDuration('time', "PT1h30m")).to.throw("time: PT1h30m is not a valid ISO8601 Duration")
  })
  it("does not throw for valid durations", () => {
    expect(() => _testing.throwIfInvalidDuration('', "PT1H30M")).not.to.throw()
  })
  it("does not throw for null durations", () => {
    expect(() => _testing.throwIfInvalidDuration('', null)).not.to.throw()
  });
});

describe("isValidDuration", () => {
  it("returns true for valid durations", () => {
    expect(_testing.isValidDuration("PT1H30M")).to.be.true
  })
  it("returns true for null durations", () => {
    expect(_testing.isValidDuration(null)).to.be.true
  })
  it("returns false for invalid durations", () => {
    expect(_testing.isValidDuration("PT1h30m")).to.be.false
  })
});