export type UserPayload = {
	email: string;
	roleId: string;
	isActive: string;
};

export type UserProps = {
	id: string;
	email: string;
	role: string;
};

export type UserWithRoleProps = {
	id: string;
	email: string;
	isActive: boolean;
	role: {
		id: string;
		role: string;
	};
};
