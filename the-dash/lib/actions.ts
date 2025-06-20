"use server";

import { comparePasswordHash, hashPassword } from "@/lib/helper";
import { AuthPayload } from "@/lib/types";
import { prismadb } from "@/lib/prismadb";
import { createJWT, verifyToken } from "@/lib/session";
import { cookies } from "next/headers";

export const checkSession = async (type: "get" | "strict" | "admin-only" | "author-only", props?: string) => {
	const token = (await cookies()).get("token")?.value;
	if (!token) return { success: false, message: "You are not authorized to call this action.", data: null };

	const session = await getCurrentUser(token);
	if (!session.success) return { success: false, message: "You are not authorized to call this action.", data: null };

	switch (type) {
		case "strict":
			if (session?.data?.role !== "ADMIN") return { success: false, message: "You are not authorized to call this action.", data: null };
			if (session.data?.email === props) return { success: false, message: "You are trying to altering yourself.", data: null };

			return { success: true, message: "User authorized to continue", data: session.data };
		case "admin-only":
			if (session?.data?.role !== "ADMIN") return { success: false, message: "You are not authorized to call this action.", data: null };
			return { success: true, message: "User authorized to continue", data: session.data };
		case "author-only":
			if (session?.data?.id !== props) return { success: false, message: "You are not authorized to call this action.", data: null };
			return { success: true, message: "User authorized to continue", data: session.data };
		case "get":
			return { success: true, message: "User authorized to continue", data: session.data };
		default:
			return { success: false, message: "Something went wrong at session check.", data: null };
	}
};

export const seedRole = async () => {
	try {
		await prismadb.role.create({
			data: { role: "ADMIN", createdBy: "GOD" },
		});
		await prismadb.role.create({
			data: { role: "USER", createdBy: "GOD" },
		});

		return { success: true, message: "Seed Role: Success" };
	} catch (err) {
		console.log(err);
		return { success: false, message: "Seed Role: Failed" };
	}
};

export const getRoleByName = async (name: string) => {
	try {
		const role = await prismadb.role.findUnique({ select: { id: true, role: true }, where: { role: name } });
		return { success: true, message: "Get Role: Success", data: role };
	} catch (err) {
		console.log(err);
		return { success: false, message: "Get Role: Failed" };
	}
};

export const authenticate = async (values: AuthPayload) => {
	const { email, password } = values;

	try {
		// Check email
		const user = await prismadb.user.findUnique({ where: { email }, include: { role: { select: { role: true } } } });
		if (!user) return { success: false, message: "Login Failed: Invalid credentials" };

		// Check password
		const compPassw = await comparePasswordHash(password, user.pwd);
		if (!compPassw) return { success: false, message: "Login Failed: Invalid credentials" };

		const token = await createJWT(user.id);
		if (!token) return { success: false, message: "Login Failed: Invalid credentials" };

		// Set cookie
		(await cookies()).set("token", token, {
			httpOnly: true,
			maxAge: 60 * 60 * 24 * 2, // 2 days
		});

		return { success: true, message: "Login Success: Welcome to the Jungle!", token, user };
	} catch (err) {
		console.log(err);
		return { success: false, message: "Login Failed: Please try again" };
	}
};

export const logout = async () => {
	(await cookies()).delete("token");
};

export const getCurrentSession = async () => {
	const token = (await cookies()).get("token")?.value;
	if (!token) return { success: false, message: "You are not authenticated! Please login first.", data: null };

	const resToken = await verifyToken(token);
	return { success: true, message: "Get Token: Success.", data: resToken };
};

export const getCurrentUser = async (token: string) => {
	const { id } = await verifyToken(token);
	// console.log("userId aaaaa", id);
	try {
		const user = await prismadb.user.findUnique({
			select: {
				id: true,
				email: true,
				role: {
					select: {
						id: true,
						role: true,
					},
				},
			},
			where: {
				id: id as string,
			},
		});
		if (!user) return { success: false, message: "Get User: Failed", data: null };

		const data = { id: user?.id ?? "", email: user?.email ?? "", role: user?.role.role ?? "" };
		// console.log("getCurrentUser: ", data);

		return { success: true, message: "Get User: Success", data };
	} catch (err) {
		console.log(err);
		return { success: false, message: "Get User: Failed", data: null };
	}
};

export const getAllUsers = async () => {
	console.log(`getAllUserHit`);
	try {
		const roles = await prismadb.user.findMany({ select: { id: true, email: true, isActive: true, role: { select: { id: true, role: true } } } });
		return { success: true, message: "Get User: Success", data: roles };
	} catch (err) {
		console.log(err);
		return { success: false, message: "Get User: Failed" };
	}
};

export const createUser = async (payload: AuthPayload) => {
	const { email, password } = payload;
	const hashedPass = await hashPassword(password);

	const userRoleId = await getRoleByName("USER");
	if (!userRoleId) return { success: false, message: "Register User: Failed, no role provided." };

	try {
		await prismadb.user.create({
			data: {
				email: email,
				pwd: hashedPass,
				roleId: userRoleId?.data?.id ?? "",
				createdBy: email,
			},
		});

		return { success: true, message: "Register User: Success" };
	} catch (error) {
		if (typeof error === "object" && error !== null && "code" in error && typeof error.code === "string") {
			switch (error.code) {
				case "P2002": // Unique constraint failed (You tried to create or update a record that would violate a @unique constraint.)
					return { success: false, message: `${email} already exists. email must be unique.` };
				case "P2003": // Foreign Key Constraint Failed (You tried to reference or delete a record that's linked to another via a foreign key.)
					return { success: false, message: `Cannot delete user. It's assigned to users.` };
				case "P2016": // Query interpretation error (Can happen if your query tries to reference something that doesn’t exist.)
					return { success: false, message: `Reference not found` };
				case "P2025":
					return { success: false, message: "Record not found" };
				default:
					return { success: false, message: `Known request error` };
			}
		}

		return { success: false, message: "An unexpected error occurred." };
	}
};
