import { asyncFilter, asyncMap, compareByDate, compareByName, compareByOrder } from "./list.utils";

describe("list utils", () => {
  describe("stacking comparisons", () => {
    it("will sort sequentially (favoring the final sort)", () => {
      const a = { name: "a", order: 4, date: new Date("2023-03-08") };
      const b = { name: "b", order: 3, date: new Date("2023-03-10") };
      const c = { name: "c", order: 2, date: new Date("2023-03-09") };
      const d = { name: "d", order: 1, date: new Date("2023-03-11") };
      const unsorted = [d, b, a, c];

      const sortedNameOrderDate = unsorted.sort(compareByName).sort(compareByOrder).sort(compareByDate);
      expect(sortedNameOrderDate).to.deep.equal([a, c, b, d]);
      const sortedNameDateOrder = unsorted.sort(compareByName).sort(compareByDate).sort(compareByOrder);
      expect(sortedNameDateOrder).to.deep.equal([d, c, b, a]);
      const sortedDateOrderName = unsorted.sort(compareByDate).sort(compareByOrder).sort(compareByName);
      expect(sortedDateOrderName).to.deep.equal([a, b, c, d]);
    });
  });

  describe("compare by name", () => {
    it("returns -1 when a's name is before b's name", () => {
      const a = { name: "a" };
      const b = { name: "b" }
      expect(compareByName(a, b)).equals(-1)
    })
    it("returns 1 when a is before b but order is desc", () => {
      const a = { name: "a" };
      const b = { name: "b" }
      expect(compareByName(a, b, false)).equals(1)
    });
    it("returns 0 when a and b are the same name", () => {
      const a = { name: "a" };
      const b = { name: "a" }
      expect(compareByName(a, b)).equals(0)
    });
    it("returns 1 when a's name is after b's name by default", () => {
      const a = { name: "b" };
      const b = { name: "a" }
      expect(compareByName(a, b)).equals(1)
    });
  });

  describe('compare by order', () => {
    it("returns -1 when a's order is before b's order", () => {
      const a = { order: 1 };
      const b = { order: 2 }
      expect(compareByOrder(a, b)).equals(-1)
    })
    it("returns 1 when a is before b but order is desc", () => {
      const a = { order: 1 };
      const b = { order: 2 }
      expect(compareByOrder(a, b, false)).equals(1)
    });
    it("returns 0 when a and b are the same order", () => {
      const a = { order: 1 };
      const b = { order: 1 }
      expect(compareByOrder(a, b)).equals(0)
    });
    it("returns 1 when a's order is after b's order by default", () => {
      const a = { order: 2 };
      const b = { order: 1 }
      expect(compareByOrder(a, b)).equals(1)
    });
    it('will handle missing data', () => {
      const a = { name: "a", order: 0, date: new Date("2023-03-08") };
      const b = { name: "b", order: null, date: new Date("2023-03-10") };
      const c = { name: "c", order: undefined, date: new Date("2023-03-10") };
      const d = { name: "d", order: 1, date: new Date("2023-03-10") };
      const e = { name: "e", order: 2, date: new Date("2023-03-10") };
      const f = { name: "f", order: 3, date: new Date("2023-03-10") };

      const unsorted = [b, e, c, f, d, a];
      const sortedOrder = unsorted.sort(compareByOrder);
      expect(sortedOrder).to.deep.equal([a, d, e, f, b, c]);
    })
  });

  describe("compare by date", () => {
    it("returns -1 when a's date is before b's date", () => {
      const a = { date: new Date("2023-03-08") };
      const b = { date: new Date("2023-03-09") }
      expect(compareByDate(a, b)).equals(-1)
    })
    it("returns 1 when a is before b but order is desc", () => {
      const a = { date: new Date("2023-03-08") };
      const b = { date: new Date("2023-03-09") }
      expect(compareByDate(a, b, false)).equals(1)
    });
    it("returns 0 when a and b are the same date", () => {
      const a = { date: new Date("2023-03-08") };
      const b = { date: new Date("2023-03-08") }
      expect(compareByDate(a, b)).equals(0)
    });
    it("returns 1 when a's date is after b's date by default", () => {
      const a = { date: new Date("2023-03-09") };
      const b = { date: new Date("2023-03-08") }
      expect(compareByDate(a, b)).equals(1)
    });
    it('can take a key to compare by', () => {
      const a = { created: new Date("2023-03-09") };
      const b = { created: new Date("2023-03-08") }
      expect(compareByDate(a, b, true, "created")).equals(1)
    });
    it('will throw if the key is not a date', () => {
      const a = { created: "2023-03-09" };
      const b = { created: "2023-03-08" }
      expect(() => compareByDate(a, b, true, "created")).to.throw()
    });
  })
});

describe("asyncFilter", () => {
  test("async filter returns empty array when no items match", async () => {
    const result = await asyncFilter([1, 2, 3], async (item) => item > 3);
    expect(result).to.deep.equal([]);
  });
  test("async filter returns all items when all items match", async () => {
    const result = await asyncFilter([1, 2, 3], async (item) => item < 4);
    expect(result).to.deep.equal([1, 2, 3]);
  });
  test("async filter really works with async functions", async () => {
    const arr = [1, 2, 3, 4, 5];
    const promised = async (i: number) => i % 2 === 0;
    const result = await asyncFilter(arr, promised);
    expect(result).to.deep.equal([2, 4]);
  });
});
describe("asyncMap", () => {
  test("async map transforms a list", async () => {
    const arr = [1, 2, 3, 4, 5];
    const promised = async (i: number) => i * 2;
    const result = await asyncMap(arr, promised);
    expect(result).to.deep.equal([2, 4, 6, 8, 10]);
  });
});
