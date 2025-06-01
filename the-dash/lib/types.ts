export type AuthPayload = {
	email: string;
	password: string;
};

export type RolePayload = {
	role: string;
	isActive: string;
};

export type UserPayload = {
	email: string;
	role: string;
	isActive: string;
};

export type UserWithRoleType = {
	id: string;
	email: string;
	isActive: boolean;
	role: {
		id: string;
		role: string;
	};
};

export type User = {
	id: string;
	email: string;
	role: string;
	// token: string;
};

export type RoleProps = {
	id: string;
	role: string;
	isActive: boolean;
};
