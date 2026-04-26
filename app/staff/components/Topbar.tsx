import Link from "next/link";
import { logout } from "../login/actions";

export function StaffTopbar({ section }: { section?: string }) {
  return (
    <header className="staff-topbar">
      <div className="staff-topbar-left">
        <Link href="/staff" className="staff-brand" aria-label="ダッシュボードへ">
          <img
            src="/images/logo-passo.png"
            alt="Passo a Passo"
            className="staff-brand-logo"
          />
        </Link>
        {section && <span className="staff-section-label">{section}</span>}
      </div>
      <div className="staff-topbar-right">
        <form action={logout}>
          <button type="submit" className="staff-logout-btn">ログアウト</button>
        </form>
      </div>
    </header>
  );
}
