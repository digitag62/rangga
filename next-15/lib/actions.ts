"use server";

import { AuthError } from "next-auth";
import { auth, signIn } from "@/auth";

import prismadb from "@/lib/prisma";
import { hashPassword } from "@/lib/helpers";
import {
  LoginProps,
  NavGroupPayloadProps,
  NavPayloadProps,
  RegisterProps,
  RolePayloadProps,
  UserPayloadProps,
} from "@/lib/types";
import { revalidatePath } from "next/cache";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function checkSession(
  type: "get" | "strict" | "admin-only",
  email?: string
) {
  const session = await auth();
  if (!session?.user)
    return {
      success: false,
      message: "You are not authorized to call this action.",
      data: null,
    };

  switch (type) {
    case "strict":
      if (session?.user.role !== "ADMIN")
        return {
          success: false,
          message: "You are not authorized to call this action.",
          data: null,
        };
      if (session.user.email === email)
        return {
          success: false,
          message: "You are trying to altering yourself.",
          data: null,
        };
      return {
        success: true,
        message: "User authorized to continue",
        data: session,
      };
    case "admin-only":
      if (session?.user.role !== "ADMIN")
        return {
          success: false,
          message: "You are not authorized to call this action.",
          data: null,
        };
      return {
        success: true,
        message: "User authorized to continue",
        data: session,
      };

    case "get":
      return {
        success: true,
        message: "User authorized to continue",
        data: session,
      };

    default:
      return {
        success: false,
        message: "Something went wrong at session check.",
      };
  }
}

export const authenticate = async (payload: LoginProps) => {
  try {
    const res = await signIn("credentials", { ...payload, redirect: false });
    return { success: true, message: `Welcome ${payload.email}` };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, message: "Invalid Credentials" };
        default:
          return {
            success: false,
            message: "There was a problem with your request",
          };
      }
    }
    throw error;
  }
};

// User
export const createUser = async (payload: RegisterProps) => {
  const hashedPassword = await hashPassword(payload.password);

  try {
    await prismadb.user.create({
      data: {
        email: payload.email,
        pwd: hashedPassword,
        createdBy: payload.email,
      },
    });

    return { success: true, message: "Register User: Success" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Register User: Failed" };
  }
};

export const updateUser = async (id: string, values: UserPayloadProps) => {
  const sessionCheck = await checkSession("strict", values.email);
  if (!sessionCheck.success)
    return { success: false, message: sessionCheck.message };

  try {
    if (values.pwd) {
      const hashedPassword = await hashPassword(values.pwd);

      await prismadb.user.update({
        where: {
          id: id,
        },
        data: {
          email: values.email,
          pwd: hashedPassword,
          roleId: values.roleId,
          updatedBy: sessionCheck.data?.user?.email!,
        },
      });
    } else {
      await prismadb.user.update({
        where: {
          id: id,
        },
        data: {
          email: values.email,
          roleId: values.roleId,
          updatedBy: sessionCheck.data?.user?.email!,
        },
      });
    }

    revalidatePath("/dashboard/settings/user");
    return { success: true, message: "User updated successfully." };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002": // Unique constraint failed
          // console.error("Unique constraint failed:", error.message);
          return {
            success: false,
            message: `Unique constraint failed: ${values.email} already registered`,
          };
        case "P2003": // Unique constraint failed
          // console.error("Unique constraint failed:", error.message);
          return {
            success: false,
            message: `You are trying to delete user that already have an user.`,
          };
        case "P2016": // Foreign key constraint failed
          // console.error("Foreign key constraint failed:", error.message);
          return {
            success: false,
            message: `Foreign key constraint failed: ${error.message}`,
          };
        default:
          // console.error("Known request error:", error.message);
          return {
            success: false,
            message: `Known request error: ${error.message}`,
          };
      }
    }
    throw error;
  }
};

export const deleteUser = async (id: string, email: string) => {
  const sessionCheck = await checkSession("strict", email);
  if (!sessionCheck.success)
    return { success: false, message: sessionCheck.message };

  try {
    await prismadb.user.delete({ where: { id } });
    revalidatePath("/dashboard/settings/user");
    return { success: true, message: "User deleted successfully." };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002": // Unique constraint failed
          // console.error("Unique constraint failed:", error.message);
          return {
            success: false,
            message: `Unique constraint failed: ${error.message}`,
          };
        case "P2003": // Unique constraint failed
          // console.error("Unique constraint failed:", error.message);
          return {
            success: false,
            message: `You are trying to delete user that already have an user.`,
          };
        case "P2016": // Foreign key constraint failed
          // console.error("Foreign key constraint failed:", error.message);
          return {
            success: false,
            message: `Foreign key constraint failed: ${error.message}`,
          };
        default:
          // console.error("Known request error:", error.message);
          return {
            success: false,
            message: `Known request error: ${error.message}`,
          };
      }
    }
    throw error;
  }
};

// NavGroup
export const createNavGroup = async (payload: NavGroupPayloadProps) => {
  const sessionCheck = await checkSession("admin-only");
  if (!sessionCheck.success)
    return { success: false, message: sessionCheck.message };

  try {
    await prismadb.navGroup.create({
      data: {
        title: payload.title,
        url: payload.url,
        icon: payload.icon,
        createdBy: sessionCheck.data?.user?.email!,
      },
    });

    return { success: true, message: "Create Nav Group: Success" };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002": // Unique constraint failed
          // console.error("Unique constraint failed:", error.message);
          return {
            success: false,
            message: `Unique constraint failed: ${payload.title} already registered`,
          };
        case "P2003": // Unique constraint failed
          // console.error("Unique constraint failed:", error.message);
          return {
            success: false,
            message: `You are trying to delete nav group that already have an user.`,
          };
        case "P2016": // Foreign key constraint failed
          // console.error("Foreign key constraint failed:", error.message);
          return {
            success: false,
            message: `Foreign key constraint failed: ${error.message}`,
          };
        default:
          // console.error("Known request error:", error.message);
          return {
            success: false,
            message: `Known request error: ${error.message}`,
          };
      }
    }
    throw error;
  }
};

export const updateNavGroup = async (
  id: string,
  values: NavGroupPayloadProps
) => {
  const sessionCheck = await checkSession("admin-only");
  if (!sessionCheck.success)
    return { success: false, message: sessionCheck.message };

  try {
    await prismadb.navGroup.update({
      where: {
        id: id,
      },
      data: {
        title: values.title,
        url: values.url,
        icon: values.icon,
        updatedBy: sessionCheck.data?.user?.email!,
      },
    });
    revalidatePath("/dashboard/settings/nav-group");
    return { success: true, message: "NavGroup updated successfully." };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002": // Unique constraint failed
          // console.error("Unique constraint failed:", error.message);
          return {
            success: false,
            message: `Unique constraint failed: ${values.title.toUpperCase()} already registered`,
          };
        case "P2003": // Unique constraint failed
          // console.error("Unique constraint failed:", error.message);
          return {
            success: false,
            message: `You are trying to delete nav group that already have an user.`,
          };
        case "P2016": // Foreign key constraint failed
          // console.error("Foreign key constraint failed:", error.message);
          return {
            success: false,
            message: `Foreign key constraint failed: ${error.message}`,
          };
        default:
          // console.error("Known request error:", error.message);
          return {
            success: false,
            message: `Known request error: ${error.message}`,
          };
      }
    }
    throw error;
  }
};

export const deleteNavGroup = async (id: string) => {
  const sessionCheck = await checkSession("admin-only");
  if (!sessionCheck.success)
    return { success: false, message: sessionCheck.message };

  try {
    await prismadb.navGroup.delete({ where: { id } });
    revalidatePath("/dashboard/settings/nav-group");
    return { success: true, message: "Nav Group deleted successfully." };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002": // Unique constraint failed
          // console.error("Unique constraint failed:", error.message);
          return {
            success: false,
            message: `Unique constraint failed: ${error.message}`,
          };
        case "P2003": // Unique constraint failed
          // console.error("Unique constraint failed:", error.message);
          return {
            success: false,
            message: `You are trying to delete nav group that already have a nav.`,
          };
        case "P2016": // Foreign key constraint failed
          // console.error("Foreign key constraint failed:", error.message);
          return {
            success: false,
            message: `Foreign key constraint failed: ${error.message}`,
          };
        default:
          // console.error("Known request error:", error.message);
          return {
            success: false,
            message: `Known request error: ${error.message}`,
          };
      }
    }
    throw error;
  }
};

export const createNav = async (payload: NavPayloadProps) => {
  try {
    await prismadb.nav.create({
      data: {
        title: payload.title,
        url: payload.url,
        isActive: payload.isActive,
        access: payload.access,
        navGroupId: payload.group,
        createdBy: payload.email,
      },
    });

    return { success: true, message: "Create Nav: Success" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Create Nav: Failed" };
  }
};

// role
export const createRole = async (payload: RolePayloadProps) => {
  const sessionCheck = await checkSession("admin-only");
  if (!sessionCheck.success)
    return { success: false, message: sessionCheck.message };

  try {
    await prismadb.role.create({
      data: {
        role: payload.role.toUpperCase(),
        createdBy: sessionCheck.data?.user?.email!,
      },
    });

    revalidatePath("/dashboard/settings/role");
    return { success: true, message: "Create Role: Success" };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002": // Unique constraint failed
          // console.error("Unique constraint failed:", error.message);
          return {
            success: false,
            message: `Unique constraint failed: ${payload.role.toUpperCase()} already registered`,
          };
        case "P2003": // Unique constraint failed
          // console.error("Unique constraint failed:", error.message);
          return {
            success: false,
            message: `You are trying to delete role that already have an user.`,
          };
        case "P2016": // Foreign key constraint failed
          // console.error("Foreign key constraint failed:", error.message);
          return {
            success: false,
            message: `Foreign key constraint failed: ${error.message}`,
          };
        default:
          // console.error("Known request error:", error.message);
          return {
            success: false,
            message: `Known request error: ${error.message}`,
          };
      }
    }
    throw error;
  }
};

export const updateRole = async (id: string, values: RolePayloadProps) => {
  const sessionCheck = await checkSession("admin-only");
  if (!sessionCheck.success)
    return { success: false, message: sessionCheck.message };

  try {
    await prismadb.role.update({
      where: {
        id: id,
      },
      data: {
        role: values.role.toUpperCase(),
        updatedBy: sessionCheck.data?.user?.email!,
      },
    });
    revalidatePath("/dashboard/settings/role");
    return { success: true, message: "Role updated successfully." };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002": // Unique constraint failed
          // console.error("Unique constraint failed:", error.message);
          return {
            success: false,
            message: `Unique constraint failed: ${values.role.toUpperCase()} already registered`,
          };
        case "P2003": // Unique constraint failed
          // console.error("Unique constraint failed:", error.message);
          return {
            success: false,
            message: `You are trying to delete role that already have an user.`,
          };
        case "P2016": // Foreign key constraint failed
          // console.error("Foreign key constraint failed:", error.message);
          return {
            success: false,
            message: `Foreign key constraint failed: ${error.message}`,
          };
        default:
          // console.error("Known request error:", error.message);
          return {
            success: false,
            message: `Known request error: ${error.message}`,
          };
      }
    }
    throw error;
  }
};

export const deleteRole = async (id: string) => {
  const sessionCheck = await checkSession("admin-only");
  if (!sessionCheck.success)
    return { success: false, message: sessionCheck.message };

  try {
    await prismadb.role.delete({ where: { id } });
    revalidatePath("/dashboard/settings/role");
    return { success: true, message: "Role deleted successfully." };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002": // Unique constraint failed
          // console.error("Unique constraint failed:", error.message);
          return {
            success: false,
            message: `Unique constraint failed: ${error.message}`,
          };
        case "P2003": // Unique constraint failed
          // console.error("Unique constraint failed:", error.message);
          return {
            success: false,
            message: `You are trying to delete role that already have an user.`,
          };
        case "P2016": // Foreign key constraint failed
          // console.error("Foreign key constraint failed:", error.message);
          return {
            success: false,
            message: `Foreign key constraint failed: ${error.message}`,
          };
        default:
          // console.error("Known request error:", error.message);
          return {
            success: false,
            message: `Known request error: ${error.message}`,
          };
      }
    }
    throw error;
  }
};
