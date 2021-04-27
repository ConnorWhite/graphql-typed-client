import { BuildSchemaOptions, ParseOptions } from 'graphql'
import { GraphQLSchemaValidationOptions } from 'graphql/type/schema'
import { SchemaFetcher } from './schema/fetchSchema'
import { Options as SchemaPrintOptions } from 'graphql/utilities/printSchema'

export interface Options {
  schemaValidation?: GraphQLSchemaValidationOptions
  schemaPrint?: SchemaPrintOptions
  schemaBuild?: BuildSchemaOptions & ParseOptions
  typeMapper?: { location: string; types: [string] }
}

export interface Config {
  endpoint?: string
  post?: boolean
  headers?: string[]
  schema?: string
  output?: string
  fetcher?: string | SchemaFetcher
  options?: Options
}
