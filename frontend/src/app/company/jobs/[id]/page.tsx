"use client";
import { useParams, useRouter } from "next/navigation";
import { AppShell, BackLink, PageHeading } from "@/components/AppShell";
import { Card } from "@/components/ui";
import JobForm, { type JobFormValues } from "@/components/JobForm";
import { useAuthenticatedResource } from "@/hooks/useAuthenticatedResource";
import { apiFetch, ApiError } from "@/lib/api";
import { clearToken, getToken } from "@/lib/auth";
import type { JobPosting } from "@/lib/types";
export default function EditCompanyJobPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const {
    data: job,
    loading,
    error,
  } = useAuthenticatedResource<JobPosting>(
    "company",
    `/company/jobs/${id}`,
    "/login?account_type=company"
  );
  const update = async (values: JobFormValues) => {
    const token = getToken("company");
    if (!token) throw new Error("ログインし直してください。");
    try {
      await apiFetch<JobPosting>(`/company/jobs/${id}`, {
        method: "PATCH",
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
      throw new Error("求人を更新できませんでした。");
    }
  };
  return (
    <AppShell role="company">
      {loading ? (
        <div className="state-card">
          <span className="spinner" />
          読み込み中...
        </div>
      ) : error ? (
        <div className="state-card state-card--error">{error}</div>
      ) : (
        job && (
          <>
            <BackLink href="/company/jobs">求人管理へ戻る</BackLink>
            <PageHeading eyebrow="Edit job posting" title="求人を編集" />
            <Card>
              <JobForm
                initialValues={{
                  title: job.title,
                  description: job.description,
                  location: job.location ?? "",
                  compensation: job.compensation ?? "",
                  period: job.period ?? "",
                  requiredSkills: job.required_skills ?? "",
                }}
                submitLabel="変更を保存"
                onSubmit={update}
              />
            </Card>
          </>
        )
      )}
    </AppShell>
  );
}
