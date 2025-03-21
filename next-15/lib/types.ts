export type RegisterProps = {
  email: string;
  password: string;
};

export type LoginProps = {
  email: string;
  password: string;
};

export type User = {
  email: string;
  pwd: string;
  role: string;
  roleId: string;
};

export type NavGroupPayloadProps = {
  title: string;
  url: string;
  icon: string;
  email: string;
};

export type RolePayloadProps = {
  role: string;
  email: string;
};

export type RoleProps = {
  id: string;
  role: string;
  createdAt: Date;
  updatedAt: Date | null;
  createdBy: string;
  updatedBy: string | null;
};

export type NavGroupProps = {
  id: string;
  createdAt: Date;
  updatedAt: Date | null;
  createdBy: string;
  updatedBy: string | null;
  title: string;
  url: string;
  icon: string;
};

export type NavLinkProps = {
  id: string;
  title: string;
  url: string;
  navGroupId: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  createdBy: string;
  updatedBy: string | null;
};

export type AllUserProps = {
  role: {
    role: string;
    id: string;
  } | null;
  id: string;
  email: string;
};
