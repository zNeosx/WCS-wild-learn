import { hash } from "argon2";
import { IsEmail, IsStrongPassword, Length, Matches } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";
import {
	BaseEntity,
	BeforeInsert,
	Column,
	Entity,
	PrimaryGeneratedColumn,
} from "typeorm";

export enum UserRole {
	ADMIN = "admin",
	VISITOR = "visitor",
}

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

	@Column({ enum: UserRole, default: UserRole.VISITOR })
	@Field()
	role: UserRole;

	@Column()
	@Field()
	email: string;

	@Column()
	@Field()
	pseudo: string;

	@Column()
	hashedPassword: string;
}

@InputType()
export class NewUserInput {
	@IsEmail()
	@Field()
	email: string;

	@Length(2, 20)
	@Field()
	pseudo: string;

	@Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/, {
		message: "Password too weak",
	})
	@Field()
	password: string;

	@Field({ nullable: true })
	role: UserRole;
}

@InputType()
export class SigninInput {
	@IsEmail()
	@Field()
	email: string;

	@Field()
	password: string;
}
