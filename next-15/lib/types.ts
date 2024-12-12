export type RegisterProps = {
  email: string;
  password: string;
};

export type LoginProps = {
  email: string;
  password: string;
};

export type User = {
  id: string;
  email: string;
  pwd: string;
  role: string;
  createdAt: Date;
  updatedAt: Date | null;
  createdBy: string;
  updatedBy: string | null;
};
