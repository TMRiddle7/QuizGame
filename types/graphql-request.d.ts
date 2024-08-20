declare module 'graphql-request' {
    import { DocumentNode } from 'graphql';
  
    export class GraphQLClient {
      constructor(endpoint: string, options?: { headers?: { [key: string]: string } });
      request<T = any>(query: string | DocumentNode, variables?: { [key: string]: any }): Promise<T>;
    }
  
    export function gql(literals: TemplateStringsArray, ...placeholders: any[]): DocumentNode;
  }