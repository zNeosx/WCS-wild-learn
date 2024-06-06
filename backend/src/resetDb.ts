import db from "./db";
import User, { UserRole } from "./entities/user";

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

	const user = new User();

	Object.assign(user, {
		email: "test@test.test",
		password: "Test123456!",
		pseudo: "Test",
	});

	await user.save();
	const admin = new User();

	Object.assign(admin, {
		email: "admin@gmail.com",
		password: "Admin@123",
		pseudo: "Admin",
		role: UserRole.ADMIN,
	});

	await admin.save();

	await db.destroy();

	console.log(`${user.email} created`);
};

main();
