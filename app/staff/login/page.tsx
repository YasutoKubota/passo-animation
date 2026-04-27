import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyPin } from "./actions";

export const metadata: Metadata = {
  title: "ログイン",
};

export default async function StaffLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const cookieStore = await cookies();
  const existing = cookieStore.get("staff_pin")?.value;
  if (existing && existing === process.env.STAFF_PIN) {
    const params = await searchParams;
    redirect(params.next && params.next.startsWith("/staff") ? params.next : "/staff");
  }

  const params = await searchParams;
  const errored = params.error === "1";
  const next = params.next ?? "/staff";

  return (
    <div className="staff-login-shell">
      <form action={verifyPin} className="staff-login-card">
        <h1>スタッフログイン</h1>
        <p>PIN コードを入力してください。</p>
        <input type="hidden" name="next" value={next} />
        <input
          type="password"
          name="pin"
          inputMode="numeric"
          autoComplete="off"
          autoFocus
          required
          className="staff-login-input"
          placeholder="• • • •"
        />
        <button type="submit" className="staff-login-btn">ログイン</button>
        {errored && <div className="staff-login-error">PIN が違います</div>}
      </form>
    </div>
  );
}
