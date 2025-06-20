import bcrypt from "bcrypt";

export const hashPassword = async (password: string) => await bcrypt.hash(password, 10);
export const comparePasswordHash = async (pwd: string, hashedPwd: string) => await bcrypt.compare(pwd, hashedPwd);

// Error handler
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handlePrismaError = (error: any, label: string) => {
	if (typeof error === "object" && error !== null && "code" in error && typeof error.code === "string") {
		switch (error.code) {
			case "P2002":
				return { success: false, message: `${label} already exists. It must be unique.` };
			case "P2003":
				return { success: false, message: `Cannot delete ${label}: Foreign key constraint failed.` };
			case "P2016":
				return { success: false, message: "Reference not found" };
			case "P2025":
				return { success: false, message: "Record not found" };
			default:
				return { success: false, message: `Known request error: ${error.message}` };
		}
	}

	return { success: false, message: "An unexpected error occurred." };
};
