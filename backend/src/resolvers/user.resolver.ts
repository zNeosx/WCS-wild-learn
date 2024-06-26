import { Arg, Authorized, Ctx, Mutation, Query } from "type-graphql";
import User, { NewUserInput, SigninInput } from "../entities/user";
import { Role } from "../enums/role.enums";
import { Context } from "../interfaces/auth";
import { GraphQLError } from "graphql";
import { verify } from "argon2";
import env from "../env";
import jwt from "jsonwebtoken";

export default class UserResolver {
	@Authorized([Role.ADMIN, Role.TEACHER])
	@Query(() => [User])
	async users() {
		// SELECT * FROM User;
		const users = await User.find();

		return users;
	}

	@Authorized([Role.STUDENT, Role.TEACHER])
	@Query(() => User)
	async getUserProfile(@Ctx() ctx: Context) {
		if (!ctx.currentUser) throw new GraphQLError("you need to be logged in!");
		return User.findOneOrFail({
			where: { id: ctx.currentUser.id },
			select: ["id", "firstName", "lastName", "email", "role"],
		});
	}

	@Mutation(() => User)
	async createUser(@Arg("data", { validate: true }) data: NewUserInput) {
		// SELECT * FROM User WHERE email=data.email
		const userAlreadyExist = await User.findOneBy({ email: data.email });

		if (userAlreadyExist) {
			throw new GraphQLError(`user: ${data.email} already exist`);
		}

		const newUser = new User();

		Object.assign(newUser, data);

		return await newUser.save();
	}

	@Mutation(() => User)
	async signin(
		@Arg("data", { validate: true }) data: SigninInput,
		@Ctx() ctx: Context
	) {
		// SELECT * FROM User WHERE email=data.email
		const user = await User.findOneBy({ email: data.email });

		if (!user) {
			throw new GraphQLError(`email: ${data.email} not register`);
		}

		const isUserPassword = await verify(user.hashedPassword, data.password);

		if (!isUserPassword) {
			throw new GraphQLError("invalid password");
		}

		const token = jwt.sign(
			{
				userId: user.id,
				firstName: user.firstName,
				lastName: user.lastName,
				role: user.role,
				email: user.email,
			},
			env.JWT_PRIVATE_KEY,
			{ expiresIn: "30d" }
		);

		ctx.res.cookie("token", token, {
			httpOnly: true,
			maxAge: 30 * 24 * 60 * 60 * 1000,
			secure: env.NODE_ENV === "production",
		});

		return user;
	}

	@Mutation(() => String)
	async logout(@Ctx() ctx: Context) {
		ctx.res.clearCookie("token");

		return "ok";
	}
}
