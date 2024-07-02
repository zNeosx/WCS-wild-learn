import { Arg, Authorized, Ctx, Mutation, Query } from "type-graphql";
import Course, { NewCourseInput, UpdateCourseInput } from "../entities/course";
import User from "../entities/user";
import { Context } from "../interfaces/auth";
import { Role } from "../enums/role.enums";
import { GraphQLError } from "graphql";

export default class CourseResolver {
	@Query(() => [Course])
	async getCourses(): Promise<Course[]> {
		return await Course.find({
			relations: {
				user: true,
				attachements: true,
				category: true,
			},
		});
	}

	// @Query(() => Course)
	// async course(@Arg("id") id: string): Promise<Course | undefined> {
	// 	return Course.findOne(id);
	// }

	// Get course by id
	@Authorized([Role.TEACHER, Role.STUDENT, Role.ADMIN])
	@Query(() => Course)
	async getCourseById(@Arg("id") id: string): Promise<Course | null> {
		return await Course.findOne({
			where: { id },
			relations: {
				user: true,
				attachements: true,
				category: true,
			},
		});
	}

	@Authorized([Role.TEACHER])
	@Mutation(() => Course)
	async createCourse(
		@Arg("data") data: NewCourseInput,
		@Ctx() ctx: Context
	): Promise<Course> {
		if (!ctx.currentUser) throw new GraphQLError("you need to be logged in!");

		const course = await Course.create({
			...data,
			user: ctx.currentUser,
		}).save();

		return course;
	}
	//
	@Mutation(() => Course)
	async updateCourse(
		@Arg("id") id: string,
		@Arg("data") data: UpdateCourseInput
	): Promise<Course | null> {
		const exists = await Course.exists({
			where: {
				id,
			},
		});

		if (!exists) throw new GraphQLError("Course not found");

		const courseToUpdate = await Course.findOne({
			where: { id },
			relations: {
				user: true,
				attachements: true,
				category: true,
			},
		});

		if (!courseToUpdate) throw new GraphQLError("Course not found");

		Object.assign(courseToUpdate, data);
		await courseToUpdate.save();

		return await Course.findOne({
			where: { id },
			relations: {
				user: true,
				attachements: true,
				category: true,
			},
		});
	}

	@Mutation(() => Boolean)
	async deleteCourse(@Arg("id") id: string): Promise<boolean> {
		await Course.delete(id);

		return true;
	}
}
