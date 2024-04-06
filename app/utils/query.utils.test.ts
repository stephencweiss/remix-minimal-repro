import { findUniqueOrThrow, findFirst, findFirstOrThrow } from './query.utils';

describe('findUniqueOrThrow', () => {
  it('should return the unique element in the array', () => {
    const array = [1];
    const result = findUniqueOrThrow(array);
    expect(result).to.equal(1);
  });

  it('should throw an error if the array has more than one element', () => {
    const array = [1, 2];
    expect(() => findUniqueOrThrow(array)).to.throw();
  });

  it('should throw a custom error message if provided', () => {
    const array = [1, 2];
    const errorMessage = 'Array must have exactly one element';
    expect(() => findUniqueOrThrow(array, errorMessage)).to.throw(errorMessage);
  });
});

describe('findFirst', () => {
  it('should return the first element in the array', () => {
    const array = [1, 2, 3];
    const result = findFirst(array);
    expect(result).to.equal(1);
  });

  it('should return null if the array is empty', () => {
    const array: number[] = [];
    const result = findFirst(array);
    expect(result).to.be.null;
  });
});

describe('findFirstOrThrow', () => {
  it('should return the first element in the array', () => {
    const array = [1, 2, 3];
    const result = findFirstOrThrow(array);
    expect(result).to.equal(1);
  });

  it('should throw an error if the array is empty', () => {
    const array: number[] = [];
    expect(() => findFirstOrThrow(array)).to.throw();
  });

  it('should throw a custom error message if provided', () => {
    const array: number[] = [];
    const errorMessage = 'Array must not be empty';
    expect(() => findFirstOrThrow(array, errorMessage)).to.throw(errorMessage);
  });
});
