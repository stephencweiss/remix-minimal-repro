export interface ErrorTuple {
  key: string
  message: string
}

export const mapErrors = <T extends Record<string, string | null>>(
  defaultErrors: T,
  errorTuples: ErrorTuple[]): T => {

  const mappedTuples = errorTuples.reduce((acc, tuple) => {
    if (tuple.key in defaultErrors) {
      return { ...acc, [tuple.key]: tuple.message }
    }
    return acc;
  }, {} as Record<string, string>
  )
  return ({
    ...defaultErrors,
    global: 'An error occurred',
    ...mappedTuples
  })

}

export const errorResponseBody = <T extends Record<string, string | null>>(
  defaultErrors: T,
  errorTuples: ErrorTuple[],
  type?: string,
) => {
  return ({ type, errors: mapErrors<T>(defaultErrors, errorTuples) })
}

export const isError = (e: unknown): e is Error => {
  return e instanceof Error
}