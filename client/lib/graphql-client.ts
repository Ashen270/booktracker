const GRAPHQL_ENDPOINT = "http://localhost:4000/graphql"

export async function executeGraphQL<T>(query: string, variables?: Record<string, any>): Promise<T> {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })

  const data = await response.json()

  if (data.errors) {
    throw new Error(data.errors[0].message)
  }

  return data.data
}
