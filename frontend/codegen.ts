import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:4000/',
  documents: './src/**/*.{gql, graphql}', // Chemin vers vos fichiers GraphQL
  generates: {
    './src/graphql/generated/schema.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
      config: {
        namingConvention: {
          enumValues: 'keep',
          typeNames: 'keep',
        },
      },
    },
  },
};

export default config;
