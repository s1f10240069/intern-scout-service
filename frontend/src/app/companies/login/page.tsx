import { redirect } from "next/navigation";

export default function LegacyCompanyLoginPage() {
  redirect("/login?account_type=company");
}
