import { redirect } from "next/navigation";

export default function LegacyCompanyRegistrationPage() {
  redirect("/register?account_type=company");
}
