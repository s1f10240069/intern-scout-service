import Link from "next/link";
import type { ReactNode } from "react";
import LogoutButton from "@/components/LogoutButton";

export function AppShell({ children, role }: { children: ReactNode; role?: "student" | "company" }) {
  const homeHref = role === "company" ? "/company/students" : role === "student" ? "/mypage" : "/";
  return <div className="app-shell"><header className="site-header"><Link href={homeHref} className="brand"><span className="brand__mark">I</span><span>Intern Scout</span></Link><div className="header-actions">{role === "student" && <nav className="header-nav"><Link href="/companies">企業を探す</Link><Link href="/jobs">求人を探す</Link><Link href="/messages">メッセージ</Link><LogoutButton role={role} /></nav>}{role === "company" && <nav className="header-nav"><Link href="/company/students">学生を探す</Link><Link href="/company/jobs">求人管理</Link><Link href="/company/messages">メッセージ</Link><LogoutButton role={role} /></nav>}</div></header><main className="page-container">{children}</main></div>;
}

export function BackLink({ href, children }: { href: string; children: ReactNode }) { return <Link href={href} className="back-link">← {children}</Link>; }
export function PageHeading({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) { return <div className="page-heading"><div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h1>{title}</h1>{description && <p className="page-heading__description">{description}</p>}</div>{action && <div className="page-heading__action">{action}</div>}</div>; }
