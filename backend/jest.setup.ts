import { ASTNode, graphql, GraphQLSchema, print } from "graphql";

import db, { clearDb } from "./src/db";
import getSchema from "./src/schema";
import { Maybe } from "type-graphql";

export let schema: GraphQLSchema;

export async function execute(
	operation: ASTNode,
	{
		variableValues,
		contextValue = {},
	}: {
		variableValues?: Maybe<{
			readonly [variable: string]: unknown;
		}>;
		contextValue?: object;
	}
) {
	return await graphql({
		schema,
		source: print(operation),
		variableValues,
		contextValue,
	});
}

beforeAll(async () => {
	await db.initialize();
	schema = await getSchema;
});

beforeEach(async () => {
	await clearDb();
});

afterAll(async () => {
	await db.destroy();
});
