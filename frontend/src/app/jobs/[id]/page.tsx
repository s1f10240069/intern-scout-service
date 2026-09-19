"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppShell, BackLink, PageHeading } from "@/components/AppShell";
import { Badge, Card } from "@/components/ui";
import { useAuthenticatedResource } from "@/hooks/useAuthenticatedResource";
import type { JobPosting } from "@/lib/types";
export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const {
    data: job,
    loading,
    error,
  } = useAuthenticatedResource<JobPosting>("student", `/jobs/${id}`, "/login");
  return (
    <AppShell role="student">
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
            <BackLink href="/jobs">求人一覧へ戻る</BackLink>
            <PageHeading
              eyebrow="Job posting"
              title={job.title}
              description={`掲載企業：${job.company.name}`}
            />
            <Card className="job-detail">
              <div>
                <h2>仕事内容</h2>
                <p className="job-description">{job.description}</p>
              </div>
              <dl className="meta-list">
                <div>
                  <dt>勤務地</dt>
                  <dd>{job.location ?? "未設定"}</dd>
                </div>
                <div>
                  <dt>報酬</dt>
                  <dd>{job.compensation ?? "未設定"}</dd>
                </div>
                <div>
                  <dt>期間</dt>
                  <dd>{job.period ?? "未設定"}</dd>
                </div>
                <div>
                  <dt>求めるスキル</dt>
                  <dd>{job.required_skills ?? "未設定"}</dd>
                </div>
              </dl>
              <div className="form-actions">
                <Link className="button button--secondary" href={`/companies/${job.company.id}`}>
                  {job.company.name}の詳細を見る
                </Link>
                {job.required_skills && <Badge>{job.required_skills}</Badge>}
              </div>
            </Card>
          </>
        )
      )}
    </AppShell>
  );
}
