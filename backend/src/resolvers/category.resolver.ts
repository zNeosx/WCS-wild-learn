import { Query } from "type-graphql";
import Category from "../entities/category";

export default class CategoryResolver {
	@Query(() => [Category])
	async getCategories(): Promise<Category[]> {
		return await Category.find();
	}

	// @Query(() => Category)
	// async categoryCategory(@Arg("id") id: string): Promise<Category | undefined> {
	// 	return Category.findOne(id);
	// }

	// @Mutation(() => Category)
	// async createCategory(
	//   @Arg("data") data: NewCategoryInput,
	//   @Ctx() ctx: Context
	// ): Promise<Category> {
	//   if (!ctx.currentUser) throw new GraphQLError("you need to be logged in!");

	//   const category = await Category.create({
	//     ...data,
	//     user: ctx.currentUser,
	//   }).save();

	//   return category;
	// }
}
