import 'isomorphic-fetch'
import { buildClientSchema, ExecutionResult, getIntrospectionQuery, IntrospectionQuery } from 'graphql'
import { GraphQLSchemaValidationOptions } from 'graphql/type/schema'
import qs from 'qs'

export interface SchemaFetcher {
  (query: string, fetchImpl: typeof fetch, qsImpl: typeof qs): Promise<ExecutionResult<IntrospectionQuery>>
}

export const get = <T>(uri: string, query: { [arg: string]: any }, headers: HeadersInit = {}): Promise<T> =>
  fetch(`${uri}?${qs.stringify(query)}`, {
    headers: { ...headers },
  }).then(r => r.json())

export const post = <T>(uri: string, body: { [arg: string]: any }, headers: HeadersInit = {}): Promise<T> =>
  fetch(uri, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json', ...headers },
  }).then(r => r.json())

export const fetchSchema = async (
  endpoint: string,
  usePost = false,
  options?: GraphQLSchemaValidationOptions,
  headers?: string[],
) => {
  const jsonHeaders = headers
    ? headers.reduce(
        (retval, header) => {
          const split = header.split(':')
          if (split.length > 1) {
            retval[split[0].trim()] = split[1].trim()
          }
          return retval
        },
        {} as {
          [key: string]: string
        },
      )
    : undefined
  const result = usePost
    ? await post<ExecutionResult<IntrospectionQuery>>(endpoint, { query: getIntrospectionQuery() }, jsonHeaders)
    : await get<ExecutionResult<IntrospectionQuery>>(endpoint, { query: getIntrospectionQuery() }, jsonHeaders)

  if (!result.data) {
    throw new Error('introspection request did not receive a valid response')
  }

  return buildClientSchema(result.data, options)
}

export const customFetchSchema = async (fetcher: SchemaFetcher, options?: GraphQLSchemaValidationOptions) => {
  const result = await fetcher(getIntrospectionQuery(), fetch, qs)

  if (!result.data) {
    throw new Error('introspection request did not receive a valid response')
  }

  return buildClientSchema(result.data, options)
}
