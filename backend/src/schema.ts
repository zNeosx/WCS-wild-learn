import { buildSchemaSync } from "type-graphql";
import UserResolver from "./resolvers/user.resolver";
import { authChecker } from "./auth";

export default buildSchemaSync({
	resolvers: [UserResolver],
	authChecker,
});
