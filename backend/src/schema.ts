import { buildSchemaSync } from "type-graphql";
import UserResolver from "./resolvers/user.resolver";
import { authChecker } from "./auth";
import CourseResolver from "./resolvers/course.resolver";
import CategoryResolver from "./resolvers/category.resolver";

export default buildSchemaSync({
	resolvers: [UserResolver, CourseResolver, CategoryResolver],
	authChecker,
});
