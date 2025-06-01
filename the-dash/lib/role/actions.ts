"use server";

import { revalidatePath } from "next/cache";
import { prismadb } from "@/lib/prismadb";
import { checkSession } from "@/lib/actions";
import { RolePayload } from "@/lib/role/types";
import { handlePrismaError } from "@/lib/helper";

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
	const sessionCheck = await checkSession("admin-only");
	if (!sessionCheck.success) return { success: false, message: sessionCheck.message };

	try {
		await prismadb.role.delete({ where: { id } });
		revalidatePath("/role");
		return { success: true, message: "Delete Role: Success" };
	} catch (error) {
		return handlePrismaError(error, "Role");
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
		return handlePrismaError(error, "Role");
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
		return handlePrismaError(error, "Role");
	}
};
