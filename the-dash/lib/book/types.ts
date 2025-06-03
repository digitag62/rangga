export type BookProps = {
	id: string;
	name: string;
	summary: number;
	userId: string;
	isActive: boolean;
};

export type BookPayload = {
	name: string;
	isActive: string;
};
