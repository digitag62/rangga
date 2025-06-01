"use server";

import { revalidatePath } from "next/cache";

import { prismadb } from "@/lib/prismadb";
import { checkSession } from "@/lib/actions";
import { handlePrismaError } from "@/lib/helper";
import { UserPayload } from "@/lib/user/types";

export const updateUser = async (payload: UserPayload, id: string) => {
	const sessionCheck = await checkSession("strict", payload.email);
	if (!sessionCheck.success) return { success: false, message: sessionCheck.message };

	const { email, roleId, isActive } = payload;
	const status = isActive === "true" ? true : false;

	try {
		await prismadb.user.update({
			data: {
				email: email,
				roleId: roleId,
				isActive: status,
				updatedBy: sessionCheck.data?.email!,
			},
			where: { id },
		});

		revalidatePath("/user");
		return { success: true, message: "Update User: Success" };
	} catch (error) {
		return handlePrismaError(error, "User");
	}
};

export const deleteUser = async (id: string, email: string) => {
	const sessionCheck = await checkSession("strict", email);
	if (!sessionCheck.success) return { success: false, message: sessionCheck.message };

	try {
		await prismadb.user.delete({ where: { id } });
		revalidatePath("/user");
		return { success: true, message: "Delete user: Success" };
	} catch (error) {
		return handlePrismaError(error, "User");
	}
};
