import bcrypt from "bcrypt";

export const hashPassword = async (password: string) =>
  await bcrypt.hash(password, 10);
export const comparePasswordHash = async (pwd: string, hashedPwd: string) =>
  await bcrypt.compare(pwd, hashedPwd);

export const formatDate = (isoString: Date): string => {
	const date = new Date(isoString);

	// Extract components
	const day = date.getDate().toString().padStart(2, "0");
	const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
	const year = date.getFullYear();

	const hours = date.getHours().toString().padStart(2, "0");
	const minutes = date.getMinutes().toString().padStart(2, "0");

	// Format the date and time as dd/mm/yyyy hh:mm
	return `${day}/${month}/${year} ${hours}:${minutes}`;
};