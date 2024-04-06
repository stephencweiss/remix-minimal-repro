import { useMatches } from "@remix-run/react";
import { useMemo } from "react";

import { Recipe, RecipeIngredient, User } from "~/db/schema";

// import { createJSONErrorResponse } from "../recipes/recipe-errors";
// import { IngredientFormEntry, CreatableRecipe } from "../recipes/recipe.server";

const DEFAULT_REDIRECT = "/";

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = DEFAULT_REDIRECT,
) {
  if (!to || typeof to !== "string") {
    return defaultRedirect;
  }

  if (!to.startsWith("/") || to.startsWith("//")) {
    return defaultRedirect;
  }

  return to;
}

/**
 * TODO: move to recipes.utils.ts
 * parsePreparationSteps takes a stringified Array and converts it into a JS Array
 * Removes empty strings from the array
 */
export const parsePreparationSteps = (steps: string): string[] => {
  const parsedSteps = JSON.parse(steps);
  if (!Array.isArray(parsedSteps)) {
    return [];
  }
  return parsedSteps.filter((step) => step !== "");
};

// TODO: move to recipes.utils.ts
export const createPlaceholderIngredient = () => ({
  id: `placeholder-${Date.now().toString()}`,
  name: "",
  quantity: "",
  unit: "",
  note: "",
  isDeleted: false
});

/** Predicate to determine if an ingredient is the placeholder ingredient */
// TODO: Move to recipes.utils.ts
// export const isNotPlaceholderIngredient = (
//   ingredient: IngredientFormEntry,
// ): ingredient is IngredientFormEntry => {
//   const placeholderIngredient = createPlaceholderIngredient();
//   return !(
//     ingredient.name === placeholderIngredient.name &&
//     ingredient.quantity === placeholderIngredient.quantity &&
//     ingredient.unit === placeholderIngredient.unit &&
//     ingredient.note === placeholderIngredient.note
//   );
// };

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(
  id: string,
): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id],
  );
  return route?.data as Record<string, unknown>;
}

function isUser(user: unknown): user is User {
  return (
    user != null &&
    typeof user === "object" &&
    "username" in user &&
    typeof user.username === "string"
  );
}

export function useOptionalUser(): User | undefined {
  const data = useMatchesData("root");
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

export function useUser(): User {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead.",
    );
  }
  return maybeUser;
}

export function validateEmail(email: unknown): email is string {
  return typeof email === "string" && email.length > 3 && email.includes("@");
}

/**
 * Expects a fairly specific type of form data, where the keys are in the format:
 *  - `formKeyPrefix[index][keyName]`
 * - e.g. `ingredients[0][name]`
 * This function will extract the data from the form data and return an array of
 * objects with the key/value pairs.
 * - e.g., `[{name: "foo"}, {name: "bar"}]`
 */
export function extractGenericDataFromFormData<
  T extends Record<string, unknown>,
>(formData: FormData, formKeyPrefix: string, pattern: RegExp): Partial<T>[] {
  const formKeys = Array.from(formData.keys());
  return formKeys
    .filter((k) => k.startsWith(formKeyPrefix))
    .reduce((acc: Partial<T>[], k) => {
      // Regular expression to match the pattern and capture the number and name
      // const pattern = /deletedIngredients\[(\d+)\]\[(\w+)\]/;
      const match = k.match(pattern);

      if (match) {
        const index = Number(match[1]);
        const name = match[2] as keyof T;
        // Initialize the object at this index if it doesn't exist
        if (!acc[index]) {
          acc[index] = {};
        }
        // Add the property to the object at this index
        const value = String(formData.get(k) || "");
        acc[index] = { ...acc[index], [name]: value };
      }

      return acc;
    }, [])
    .filter((item) => Object.keys(item).length > 0);
}

// TODO: move to recipes.utils.ts and replace with zod validation
const isFullRecipe = (
  data: unknown,
): data is { recipe: Recipe & { recipeIngredients: RecipeIngredient[] } } => {
  const typedData = data as { recipe: (Recipe & { recipeIngredients: RecipeIngredient[] }) };
  const isFull = Boolean(typedData?.recipe && Array.isArray(typedData?.recipe.recipeIngredients));
  return isFull;
};

// TODO: move to recipes.utils.ts
export const getDefaultRecipeValues = (data: unknown) => {
  if (isFullRecipe(data)) {
    return {
      id: data.recipe.id,
      author: data.recipe.author ?? "",
      cookTime: data.recipe.cookTime ?? "",
      description: data.recipe.description ?? "",
      preparationSteps: data.recipe.preparationSteps ?? [''],
      prepTime: data.recipe.prepTime ?? "",
      recipeIngredients: data.recipe.recipeIngredients.map(i => ({ ...i, isDeleted: false })) ?? [createPlaceholderIngredient()],
      source: data.recipe.source ?? "",
      sourceUrl: data.recipe.sourceUrl ?? "",
      title: data.recipe.title,
      totalTime: data.recipe.totalTime ?? "",
    };
  }
  return {
    preparationSteps: [''],
    recipeIngredients: [createPlaceholderIngredient()],
  };
};

// TODO: Move to recipes.utils.ts
// export const validateUserSubmittedRecipe = (partialRecipe: CreatableRecipe) => {
//   if (partialRecipe.title.length === 0) {
//     return createJSONErrorResponse([{ key: "title", message: "Title is required" }]);
//   }
//   if (
//     !Array.isArray(partialRecipe.preparationSteps) ||
//     partialRecipe.preparationSteps.length === 0
//   ) {
//     return createJSONErrorResponse([{ key: "preparationSteps", message: "Preparation steps are required" }]);
//   }
// }