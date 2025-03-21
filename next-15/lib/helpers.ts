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

export const slugify = (name: string) => {
  return name
    .toLowerCase() // Convert to lowercase
    .trim() // Remove whitespace from both ends
    .replace(/[\s_]+/g, "-") // Replace spaces and underscores with a dash
    .replace(/[^\w\-]+/g, "") // Remove any non-word characters
    .replace(/\-\-+/g, "-") // Replace multiple dashes with a single dash
    .replace(/^-+/, "") // Remove leading dashes
    .replace(/-+$/, ""); // Remove trailing dashes
};
