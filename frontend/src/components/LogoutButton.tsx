"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { clearToken } from "@/lib/auth";

export default function LogoutButton({ role }: { role: "student" | "company" }) {
  const router = useRouter();
  const handleLogout = () => {
    clearToken(role);
    router.push(role === "company" ? "/login?account_type=company" : "/login");
  };

  return (
    <Button variant="ghost" className="header-logout" onClick={handleLogout}>
      ログアウト
    </Button>
  );
}
