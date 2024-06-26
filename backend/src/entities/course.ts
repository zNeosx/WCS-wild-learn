import { hash } from "argon2";
import { IsEmail, Matches } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";
import {
	BaseEntity,
	BeforeInsert,
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import { Role } from "../enums/role.enums";
import User from "./user";
import Attachement from "./attachement";
import Category from "./category";

@Entity()
@ObjectType()
export default class Course extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	@Field()
	id: string;

	@ManyToOne(() => User, (user) => user.courses, { onDelete: "CASCADE" })
	@Field(() => User)
	user: User;

	@Column()
	@Field(() => String)
	title: string;

	@Column({ nullable: true })
	@Field(() => String, { nullable: true })
	description: string;

	@Column({ nullable: true })
	@Field(() => String, { nullable: true })
	imageUrl: string;

	@Column({ nullable: true })
	@Field(() => Number, { nullable: true })
	price: number;

	@Column({ default: false })
	@Field(() => Boolean, { defaultValue: false })
	isPublished: boolean;

	@OneToMany(() => Attachement, (attachement) => attachement.course)
	@Field(() => [Attachement])
	attachements: Attachement[];

	@ManyToOne(() => Category, (category) => category.courses, {
		onDelete: "CASCADE",
	})
	@Field(() => Category, { nullable: true })
	category: Category;

	@CreateDateColumn()
	@Field()
	createdAt: Date;

	@UpdateDateColumn()
	@Field()
	updatedAt: Date;
}

@InputType()
export class NewCourseInput {
	@Field()
	title: string;
}

// create UpdateCourseInput
@InputType()
export class UpdateCourseInput {
	@Field({ nullable: true })
	title?: string;

	@Field({ nullable: true })
	description?: string;

	@Field({ nullable: true })
	imageUrl?: string;

	@Field({ nullable: true })
	price?: number;

	@Field({ nullable: true })
	isPublished?: boolean;
}
