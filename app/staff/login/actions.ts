"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function verifyPin(formData: FormData) {
  const pin = String(formData.get("pin") ?? "").trim();
  const next = String(formData.get("next") ?? "/staff");
  const expected = process.env.STAFF_PIN;

  if (!expected || pin !== expected) {
    redirect(`/staff/login?error=1${next ? `&next=${encodeURIComponent(next)}` : ""}`);
  }

  const cookieStore = await cookies();
  cookieStore.set("staff_pin", pin, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  redirect(next.startsWith("/staff") ? next : "/staff");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("staff_pin");
  redirect("/staff/login");
}
