import { DataSource } from "typeorm";
import env from "./env";
import User from "./entities/user";
import Course from "./entities/course";
import Category from "./entities/category";
import Attachement from "./entities/attachement";

const db = new DataSource({
	type: "postgres",
	password: env.DB_PASS,
	username: env.DB_USER,
	database: env.DB_NAME,
	host: env.DB_HOST,
	port: env.DB_PORT,
	entities: [User, Course, Category, Attachement],
	synchronize: true,
	logging: env.NODE_ENV !== "test",
});

export async function clearDb() {
	const entities = db.entityMetadatas;
	const tableNames = entities
		.map((entity) => `"${entity.tableName}"`)
		.join(", ");
	await db.query(`TRUNCATE ${tableNames} RESTART IDENTITY CASCADE;`);
}

export default db;
