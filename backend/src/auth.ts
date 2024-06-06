import { AuthChecker } from "type-graphql";
import { Context } from "./interfaces/auth";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import env from "./env";
import User from "./entities/user";

export const authChecker: AuthChecker<Context> = async (
	{ context },
	roles: string[] = []
) => {
	const { headers = {} } = context.req ?? {};
	const tokenInCookie = cookie.parse(headers.cookie ?? "").token;
	const tokenInAuthHeaders = headers.authorization?.split(" ")[1];

	const token = tokenInAuthHeaders ?? tokenInCookie;

	console.log("backend token :>> ", token);

	if (typeof token !== "string") {
		return false;
	}

	const decoded = (await jwt.verify(token, env.JWT_PRIVATE_KEY)) as any;

	if (!decoded?.userId) {
		return false;
	}

	const currentUser = await User.findOneByOrFail({ id: decoded?.userId });

	if (currentUser === null) {
		return false;
	}

	context.currentUser = currentUser;

	return roles.length === 0 || roles.includes(currentUser.role.toString());
};
