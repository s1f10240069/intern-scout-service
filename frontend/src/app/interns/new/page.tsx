import { redirect } from "next/navigation";

export default function LegacyStudentRegistrationPage() {
  redirect("/register?account_type=student");
}
