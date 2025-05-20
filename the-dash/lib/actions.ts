"use server";

import { hashPassword } from "@/lib/helper";
import { RegisterPayload } from "@/lib/types";
import { prismadb } from "@/lib/prismadb";

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

export const createUser = async (payload: RegisterPayload) => {
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
	} catch (err) {
		console.log(err);
		return { success: false, message: "Register User: Failed" };
	}
};
