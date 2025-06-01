"use server";

import { comparePasswordHash, hashPassword } from "@/lib/helper";
import { AuthPayload, RolePayload, UserPayload } from "@/lib/types";
import { prismadb } from "@/lib/prismadb";
import { createJWT, verifyToken } from "@/lib/session";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export const checkSession = async (type: "get" | "strict" | "admin-only", email?: string) => {
	const token = (await cookies()).get("token")?.value;
	if (!token) return { success: false, message: "You are not authorized to call this action.", data: null };

	const session = await getCurrentUser(token);
	if (!session.success) return { success: false, message: "You are not authorized to call this action.", data: null };

	switch (type) {
		case "strict":
			if (session?.data?.role !== "ADMIN") return { success: false, message: "You are not authorized to call this action.", data: null };
			if (session.data?.email === email) return { success: false, message: "You are trying to altering yourself.", data: null };

			return { success: true, message: "User authorized to continue", data: session.data };
		case "admin-only":
			if (session?.data?.role !== "ADMIN") return { success: false, message: "You are not authorized to call this action.", data: null };
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

		const data = { id: user?.id!, email: user?.email!, role: user?.role.role! };
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

/* ======= START OF ROLE REGION ======= */
export const getAllRoles = async () => {
	try {
		const roles = await prismadb.role.findMany({ select: { id: true, role: true }, where: { NOT: { role: "ADMIN" } } });
		return { success: true, message: "Get Role: Success", data: roles };
	} catch (err) {
		console.log(err);
		return { success: false, message: "Get Role: Failed", data: null };
	}
};

export const deleteRole = async (id: string) => {
	try {
		await prismadb.role.delete({ where: { id } });
		revalidatePath("/role");
		return { success: true, message: "Delete Role: Success" };
	} catch (error) {
		if (typeof error === "object" && error !== null && "code" in error && typeof error.code === "string") {
			switch (error.code) {
				case "P2003": // Foreign Key Constraint Failed (You tried to reference or delete a record that's linked to another via a foreign key.)
					return { success: false, message: `Cannot delete role: It is associated with one or more users.` };
				case "P2016": // Query interpretation error (Can happen if your query tries to reference something that doesn’t exist.)
					return { success: false, message: `Reference not found` };
				case "P2025":
					return { success: false, message: "Record not found" };
				default:
					return { success: false, message: `Known request error: ${(error as any).message}` };
			}
		}

		return { success: false, message: "An unexpected error occurred." };
	}
};

export const createRole = async (payload: RolePayload) => {
	const sessionCheck = await checkSession("admin-only");
	if (!sessionCheck.success) return { success: false, message: sessionCheck.message };

	const { role, isActive } = payload;
	const status = isActive === "true" ? true : false;

	try {
		await prismadb.role.create({
			data: {
				role: role,
				isActive: status,
				createdBy: sessionCheck.data?.email!,
			},
		});

		revalidatePath("/role");
		return { success: true, message: "Create Role: Success" };
	} catch (error) {
		if (typeof error === "object" && error !== null && "code" in error && typeof error.code === "string") {
			switch (error.code) {
				case "P2002": // Unique constraint failed (You tried to create or update a record that would violate a @unique constraint.)
					return { success: false, message: `${payload.role.toUpperCase()} already exists. Role must be unique.` };
				case "P2003": // Foreign Key Constraint Failed (You tried to reference or delete a record that's linked to another via a foreign key.)
					return { success: false, message: `Cannot delete role. It's assigned to users.` };
				case "P2016": // Query interpretation error (Can happen if your query tries to reference something that doesn’t exist.)
					return { success: false, message: `Reference not found` };
				case "P2025":
					return { success: false, message: "Record not found" };
				default:
					return { success: false, message: `Known request error: ${(error as any).message}` };
			}
		}

		return { success: false, message: "An unexpected error occurred." };
	}
};

export const updateRole = async (payload: RolePayload, id: string) => {
	const sessionCheck = await checkSession("admin-only");
	if (!sessionCheck.success) return { success: false, message: sessionCheck.message };

	const { role, isActive } = payload;
	const status = isActive === "true" ? true : false;

	try {
		await prismadb.role.update({
			data: {
				role: role,
				isActive: status,
				updatedBy: sessionCheck.data?.email!,
			},
			where: { id },
		});

		revalidatePath("/role");
		return { success: true, message: "Update Role: Success" };
	} catch (error) {
		if (typeof error === "object" && error !== null && "code" in error && typeof error.code === "string") {
			switch (error.code) {
				case "P2002": // Unique constraint failed (You tried to create or update a record that would violate a @unique constraint.)
					return { success: false, message: `${payload.role.toUpperCase()} already exists. Role must be unique.` };
				case "P2003": // Foreign Key Constraint Failed (You tried to reference or delete a record that's linked to another via a foreign key.)
					return { success: false, message: `Cannot delete role. It's assigned to users.` };
				case "P2016": // Query interpretation error (Can happen if your query tries to reference something that doesn’t exist.)
					return { success: false, message: `Reference not found` };
				case "P2025":
					return { success: false, message: "Record not found" };
				default:
					return { success: false, message: `Known request error: ${(error as any).message}` };
			}
		}

		return { success: false, message: "An unexpected error occurred." };
	}
};
/* ======= END OF ROLE REGION ======= */

/* ======= START OF USER REGION ======= */
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
				roleId: userRoleId?.data?.id!,
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
					return { success: false, message: `Known request error: ${(error as any).message}` };
			}
		}

		return { success: false, message: "An unexpected error occurred." };
	}
};

export const updateUser = async (payload: UserPayload, id: string) => {
	const sessionCheck = await checkSession("admin-only");
	if (!sessionCheck.success) return { success: false, message: sessionCheck.message };

	const { email, role, isActive } = payload;
	const status = isActive === "true" ? true : false;

	try {
		await prismadb.user.update({
			data: {
				email: email,
				roleId: role,
				isActive: status,
				updatedBy: sessionCheck.data?.email!,
			},
			where: { id },
		});

		revalidatePath("/user");
		return { success: true, message: "Update User: Success" };
	} catch (error) {
		if (typeof error === "object" && error !== null && "code" in error && typeof error.code === "string") {
			switch (error.code) {
				case "P2002": // Unique constraint failed (You tried to create or update a record that would violate a @unique constraint.)
					return { success: false, message: `${payload.email} already exists. User must be unique.` };
				case "P2003": // Foreign Key Constraint Failed (You tried to reference or delete a record that's linked to another via a foreign key.)
					return { success: false, message: `Cannot delete user. It's assigned to something.` };
				case "P2016": // Query interpretation error (Can happen if your query tries to reference something that doesn’t exist.)
					return { success: false, message: `Reference not found` };
				case "P2025":
					return { success: false, message: "Record not found" };
				default:
					return { success: false, message: `Known request error: ${(error as any).message}` };
			}
		}

		return { success: false, message: "An unexpected error occurred." };
	}
};
/* ======= END OF USER REGION ======= */
