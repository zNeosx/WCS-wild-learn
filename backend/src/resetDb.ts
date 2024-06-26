import db from "./db";
import User from "./entities/user";
import { Role } from "./enums/role.enums";

export const cleanDb = async () => {
	const runner = db.createQueryRunner();

	await runner.query("SET session_replication_role = 'replica'");

	await Promise.all(
		db.entityMetadatas.map((entity: any) => {
			runner.query(`ALTER TABLE "${entity.tableName}" DISABLE TRIGGER ALL`);
		})
	);

	await Promise.all(
		db.entityMetadatas.map((entity: any) => {
			runner.query(`DROP TABLE IF EXISTS "${entity.tableName}" CASCADE`);
		})
	);

	await runner.query("SET session_replication_role = 'origin'");

	await db.synchronize();
};

const main = async () => {
	await db.initialize();

	await cleanDb();

	const student1 = new User();

	Object.assign(student1, {
		lastName: "DOE",
		firstName: "John",
		email: "john.doe@gmail.com",
		password: "JohnDoe@01",
	});

	await student1.save();

	const student2 = new User();

	Object.assign(student2, {
		lastName: "LOU",
		firstName: "Chloé",
		email: "chloe.lou@gmail.com",
		password: "ChloeLou@02",
	});

	await student2.save();

	const teacher1 = new User();

	Object.assign(teacher1, {
		lastName: "JOCELINE",
		firstName: "Inès",
		email: "joceline.ines@gmail.com",
		password: "JocelineInes@01",
		role: Role.TEACHER,
	});

	await teacher1.save();

	const admin = new User();

	Object.assign(admin, {
		lastName: "ADMIN",
		firstName: "Admin",
		email: "admin@gmail.com",
		password: "Admin@123",
		role: Role.ADMIN,
	});

	await admin.save();

	await db.destroy();

	console.log("reset db successful");
};

main();
