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
import Course from "./course";

@Entity()
@ObjectType()
export default class Category extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	@Field()
	id: string;

	@Column({ unique: true })
	@Field(() => String)
	name: string;

	@OneToMany(() => Course, (course) => course.attachements, {
		cascade: true,
	})
	@Field(() => [Course])
	courses: Course[];
}
