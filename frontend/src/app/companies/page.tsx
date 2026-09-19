"use client";
import Link from "next/link";
import { AppShell, PageHeading } from "@/components/AppShell";
import { useAuthenticatedResource } from "@/hooks/useAuthenticatedResource";
import type { Company } from "@/lib/types";
export default function CompaniesPage() {
  const {
    data: companies,
    loading,
    error,
  } = useAuthenticatedResource<Company[]>("student", "/companies", "/login");
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
        <>
          <PageHeading
            eyebrow="Companies"
            title="企業を探す"
            description="気になる企業の求人や、募集している仕事を確認できます。"
          />
          {!companies?.length ? (
            <div className="empty-state">登録されている企業はまだありません。</div>
          ) : (
            <div className="list-grid">
              {companies.map((company) => (
                <Link className="list-card" key={company.id} href={`/companies/${company.id}`}>
                  <h2>{company.name}</h2>
                  <p>{company.email}</p>
                  <div className="list-card__footer">
                    <span>企業詳細を見る</span>
                    <span>→</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </AppShell>
  );
}
