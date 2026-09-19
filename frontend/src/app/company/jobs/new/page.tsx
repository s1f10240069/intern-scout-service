"use client";
import { useRouter } from "next/navigation";
import { AppShell, BackLink, PageHeading } from "@/components/AppShell";
import { Card } from "@/components/ui";
import JobForm, { type JobFormValues } from "@/components/JobForm";
import { apiFetch, ApiError } from "@/lib/api";
import { clearToken, getToken } from "@/lib/auth";
import type { JobPosting } from "@/lib/types";
export default function NewCompanyJobPage() {
  const router = useRouter();
  const create = async (values: JobFormValues) => {
    const token = getToken("company");
    if (!token) throw new Error("ログインし直してください。");
    try {
      await apiFetch<JobPosting>("/company/jobs", {
        method: "POST",
        token,
        body: {
          job_posting: {
            title: values.title,
            description: values.description,
            location: values.location,
            compensation: values.compensation,
            period: values.period,
            required_skills: values.requiredSkills,
          },
        },
      });
      router.push("/company/jobs");
    } catch (err) {
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        clearToken("company");
        router.replace("/login?account_type=company");
        throw new Error("ログインし直してください。");
      }
      if (err instanceof ApiError && err.status === 422)
        throw new Error(
          (err.data as { errors?: string[] }).errors?.join("、") ?? "入力内容を確認してください。"
        );
      throw new Error("求人を作成できませんでした。");
    }
  };
  return (
    <AppShell role="company">
      <BackLink href="/company/jobs">求人管理へ戻る</BackLink>
      <PageHeading
        eyebrow="New job posting"
        title="求人を新規作成"
        description="学生に伝わるよう、仕事内容や得られる経験を具体的に記載しましょう。"
      />
      <Card>
        <JobForm submitLabel="求人を作成" onSubmit={create} />
      </Card>
    </AppShell>
  );
}
