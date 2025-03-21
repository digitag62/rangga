"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";

import prismadb from "@/lib/prisma";
import { hashPassword } from "@/lib/helpers";
import {
  LoginProps,
  NavGroupPayloadProps,
  RegisterProps,
  RolePayloadProps,
} from "@/lib/types";

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

export const createRole = async (payload: RolePayloadProps) => {
  try {
    await prismadb.role.create({
      data: {
        role: payload.role.toUpperCase(),
        createdBy: payload.email,
      },
    });

    return { success: true, message: "Create Role: Success" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Create Role: Failed" };
  }
};

export const createNavGroup = async (payload: NavGroupPayloadProps) => {
  try {
    await prismadb.navGroup.create({
      data: {
        title: payload.title,
        url: payload.url,
        icon: payload.icon,
        createdBy: payload.email,
      },
    });

    return { success: true, message: "Create Nav Group: Success" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Create Nav Group: Failed" };
  }
};

export const createNav = async (payload: NavGroupPayloadProps) => {
  try {
    await prismadb.navGroup.create({
      data: {
        title: payload.title,
        url: payload.url,
        icon: payload.icon,
        createdBy: payload.email,
      },
    });

    return { success: true, message: "Create Nav Group: Success" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Create Nav Group: Failed" };
  }
};