"use server";

import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";
import { checkSession } from "@/lib/actions";
import { CatPayload } from "@/lib/cat/types";
import { handlePrismaError } from "@/lib/helper";

export const getAllCats = async () => {
	try {
		const data = await prismadb.cat.findMany();
		return { success: true, message: "Fetch success", data };
	} catch (error) {
		console.error(error);
		return { success: false, message: "Fetch failed", data: null };
	}
};

export const createCat = async (payload: CatPayload) => {
	const sessionCheck = await checkSession("admin-only");
	if (!sessionCheck.success) return { success: false, message: sessionCheck.message };

	try {
		await prismadb.cat.create({
			data: {
				cat: payload.cat,
				max: payload.max,
				type: payload.type,
				bookId: payload.bookId,
				userId: sessionCheck.data?.id!,
				isActive: payload.isActive === "true",
				createdBy: sessionCheck.data?.email!,
			},
		});

		revalidatePath("/cat");
		return { success: true, message: "Create Cat: Success" };
	} catch (error) {
		return handlePrismaError(error, "Cat");
	}
};

export const updateCat = async (payload: CatPayload, catId: string, userId: string) => {
	const sessionCheck = await checkSession("author-only", userId);
	if (!sessionCheck.success) return { success: false, message: sessionCheck.message };

	try {
		await prismadb.cat.update({
			data: {
				cat: payload.cat,
				max: payload.max,
				type: payload.type,
				bookId: payload.bookId,
				isActive: payload.isActive === "true",
				updatedBy: sessionCheck.data?.email!,
			},
			where: { id: catId },
		});

		revalidatePath("/cat");
		return { success: true, message: "Update Cat: Success" };
	} catch (error) {
		return handlePrismaError(error, "Cat");
	}
};

export const deleteCat = async (catId: string, userId: string) => {
	const sessionCheck = await checkSession("author-only", userId);
	if (!sessionCheck.success) return { success: false, message: sessionCheck.message };

	try {
		await prismadb.cat.delete({ where: { id: catId } });
		revalidatePath("/cat");
		return { success: true, message: "Delete Cat: Success" };
	} catch (error) {
		return handlePrismaError(error, "Cat");
	}
};
