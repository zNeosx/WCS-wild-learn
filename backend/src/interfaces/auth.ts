import express from "express";
import User from "../entities/user";

export interface Context {
	req: express.Request;
	res: express.Response;
	currentUser?: User;
}
