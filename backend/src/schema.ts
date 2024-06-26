import { buildSchemaSync } from "type-graphql";
import UserResolver from "./resolvers/user.resolver";
import { authChecker } from "./auth";
import CourseResolver from "./resolvers/course.resolver";

export default buildSchemaSync({
	resolvers: [UserResolver, CourseResolver],
	authChecker,
});
