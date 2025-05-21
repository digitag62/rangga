import { jwtVerify, SignJWT } from "jose";

const expTime = process.env.NEXT_PUBLIC_JWT_EXPIRE || "1d";
const secretKey = process.env.NEXT_PUBLIC_JWT_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export const createJWT = async (id: string) => await new SignJWT({ id }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime(expTime).sign(encodedKey);

export const verifyToken = async (token: string) => {
	try {
		const { payload } = await jwtVerify(token, encodedKey, { algorithms: ["HS256"] });
		return payload;
	} catch (error) {
		return { message: "Failed to verify session", error };
	}
};
