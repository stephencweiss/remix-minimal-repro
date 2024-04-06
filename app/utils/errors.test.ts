import { mapErrors } from "./errors";

describe("mapErrors", () => {
  it('should map error tuples to default errors', () => {
    const defaultErrors = {
      global: null,
      title: null,
      source: null,
      sourceUrl: null,
      preparationSteps: null,
      prepTime: null,
      cookTime: null,
      ingredients: null,
    };
    const errorTuples = [
      { key: 'global', message: 'An error occurred' },
      { key: 'title', message: 'Title is required' }
    ]
    const result = mapErrors(defaultErrors, errorTuples);
    expect(result).to.deep.equal({
      global: 'An error occurred',
      title: 'Title is required',
      source: null,
      sourceUrl: null,
      preparationSteps: null,
      prepTime: null,
      cookTime: null,
      ingredients: null,
    })
  });
  it('should always have a default global error', () => {
    const defaultErrors = {
      global: null,
      title: null,
      source: null,
      sourceUrl: null,
      preparationSteps: null,
      prepTime: null,
      cookTime: null,
      ingredients: null,
    };
    const errorTuples = [
      { key: 'title', message: 'Title is required' }
    ]
    const result = mapErrors(defaultErrors, errorTuples);
    expect(result).to.deep.equal({
      global: 'An error occurred',
      title: 'Title is required',
      source: null,
      sourceUrl: null,
      preparationSteps: null,
      prepTime: null,
      cookTime: null,
      ingredients: null,
    })
  })
})