import bcrypt from "bcrypt";
import { SignJWT } from "jose";

const expTime = process.env.JWT_EXPIRE || "1d";
const secretKey = process.env.JWT_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export const hashPassword = async (password: string) => await bcrypt.hash(password, 10);
export const comparePasswordHash = async (pwd: string, hashedPwd: string) => await bcrypt.compare(pwd, hashedPwd);
export const createJWT = async (id: string) => await new SignJWT({ id }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime(expTime).sign(encodedKey);
