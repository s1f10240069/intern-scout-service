import { redirect } from "next/navigation";

export default function LegacyCompanyDashboardPage() {
  redirect("/company/students");
}
