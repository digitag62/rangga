export type AuthPayload = {
	email: string;
	password: string;
};

export type User = {
	id: string;
	email: string;
	role: string;
	token: string;
};
