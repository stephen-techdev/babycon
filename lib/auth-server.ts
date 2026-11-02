import { cookies } from "next/headers";
import {
  createSession,
  deleteSession,
  getSessionUser,
} from "./db";
import type { User } from "./types";

export const ADMIN_COOKIE = "bc_admin";
export const CUSTOMER_COOKIE = "bc_session";

const baseCookie = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};

export async function getAdminSession(): Promise<User | null> {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value || "";
  return getSessionUser(token, "admin");
}

export async function getCustomerSession(): Promise<User | null> {
  const store = await cookies();
  const token = store.get(CUSTOMER_COOKIE)?.value || "";
  return getSessionUser(token, "customer");
}

export async function loginAs(userId: number, role: "admin" | "customer"): Promise<string> {
  const token = createSession(userId, role);
  const store = await cookies();
  store.set(role === "admin" ? ADMIN_COOKIE : CUSTOMER_COOKIE, token, baseCookie);
  return token;
}

export async function logout(role: "admin" | "customer"): Promise<void> {
  const store = await cookies();
  const name = role === "admin" ? ADMIN_COOKIE : CUSTOMER_COOKIE;
  const token = store.get(name)?.value;
  if (token) deleteSession(token);
  store.delete(name);
}
