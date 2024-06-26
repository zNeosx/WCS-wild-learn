import { registerEnumType } from "type-graphql";

export enum Role {
	STUDENT = "STUDENT",
	TEACHER = "TEACHER",
	ADMIN = "ADMIN",
}

registerEnumType(Role, { name: "Role" });
