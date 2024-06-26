import { hash } from "argon2";
import { IsEmail, Matches } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";
import {
	BaseEntity,
	BeforeInsert,
	Column,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
} from "typeorm";
import { Role } from "../enums/role.enums";
import Course from "./course";

@Entity()
@ObjectType()
export default class User extends BaseEntity {
	password: string;

	@BeforeInsert()
	async hashPassword() {
		this.hashedPassword = await hash(this.password);
	}

	@PrimaryGeneratedColumn("uuid")
	@Field()
	id: string;

	@Column({ enum: Role, default: Role.STUDENT })
	@Field(() => Role)
	role: Role;

	@Column()
	@Field(() => String)
	email: string;

	@Column()
	@Field(() => String)
	lastName: string;

	@Column()
	@Field(() => String)
	firstName: string;

	@Column()
	hashedPassword: string;

	@OneToMany(() => Course, (course) => course.user, { cascade: true })
	@Field(() => [Course])
	courses: Course[];
}

@InputType()
export class NewUserInput {
	@IsEmail()
	@Field()
	email: string;

	@Field()
	lastName: string;

	@Field()
	firstName: string;

	@Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/, {
		message: "Password too weak",
	})
	@Field()
	password: string;

	@Field({ nullable: true })
	role: Role;
}

@InputType()
export class SigninInput {
	@IsEmail()
	@Field()
	email: string;

	@Field()
	password: string;
}
