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
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import { Role } from "../enums/role.enums";
import User from "./user";
import Course from "./course";

@Entity()
@ObjectType()
export default class Attachement extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	@Field()
	id: string;

	@Column()
	@Field(() => String)
	name: string;

	@Column()
	@Field(() => String)
	url: string;

	@ManyToOne(() => Course, (course) => course.attachements, {
		onDelete: "CASCADE",
	})
	course: Course;

	@CreateDateColumn()
	@Field()
	createdAt: Date;

	@UpdateDateColumn()
	@Field()
	updatedAt: Date;
}
