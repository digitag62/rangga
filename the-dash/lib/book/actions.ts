"use server";

import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";
import { checkSession } from "@/lib/actions";
import { BookPayload } from "@/lib/book/types";
import { handlePrismaError } from "@/lib/helper";

export const getAllBooks = async () => {
	try {
		const data = await prismadb.book.findMany();
		return { success: true, message: "Fetch success", data };
	} catch (error) {
		console.error(error);
		return { success: false, message: "Fetch failed", data: null };
	}
};

export const createBook = async (payload: BookPayload) => {
	const sessionCheck = await checkSession("get");
	if (!sessionCheck.success) return { success: false, message: sessionCheck.message };

	try {
		await prismadb.book.create({
			data: {
				name: payload.name,
				userId: sessionCheck.data?.id ?? "",
				isActive: payload.isActive === "true",
				createdBy: sessionCheck.data?.email ?? "",
			},
		});

		revalidatePath("/book");
		return { success: true, message: "Create Book: Success" };
	} catch (error) {
		return handlePrismaError(error, "Book");
	}
};

export const updateBook = async (payload: BookPayload, bookId: string, userId: string) => {
	const sessionCheck = await checkSession("author-only", userId);
	if (!sessionCheck.success) return { success: false, message: sessionCheck.message };

	try {
		await prismadb.book.update({
			data: {
				name: payload.name,
				isActive: payload.isActive === "true",
				updatedBy: sessionCheck.data?.email ?? "",
			},
			where: { id: bookId },
		});

		revalidatePath("/book");
		return { success: true, message: "Update Book: Success" };
	} catch (error) {
		return handlePrismaError(error, "Book");
	}
};

export const deleteBook = async (bookId: string, userId: string) => {
	const sessionCheck = await checkSession("author-only", userId);
	if (!sessionCheck.success) return { success: false, message: sessionCheck.message };

	try {
		await prismadb.book.delete({ where: { id: bookId } });
		revalidatePath("/book");
		return { success: true, message: "Delete Book: Success" };
	} catch (error) {
		return handlePrismaError(error, "Book");
	}
};
