"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, clearToken } from "@/lib/auth";
import type { AuthKind } from "@/lib/auth";
import { ApiError, apiFetch } from "@/lib/api";

// Reads the stored token for `kind`, fetches `endpoint` with it, and
// redirects to `loginPath` if there's no token or the API rejects it
// (expired/invalid token). Used by any page that only authenticated
// interns/companies may see (mypage, dashboard, message threads, ...).
export function useAuthenticatedResource<T>(
  kind: AuthKind,
  endpoint: string,
  loginPath: string
) {
  const router = useRouter();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken(kind);

    if (!token) {
      router.replace(loginPath);
      return;
    }

    let cancelled = false;

    async function loadResource() {
      try {
        const resource = await apiFetch<T>(endpoint, { token: token ?? undefined });
        if (!cancelled) setData(resource);
      } catch (err) {
        if (cancelled) return;

        if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
          clearToken(kind);
          router.replace(loginPath);
          return;
        }

        setError("データを取得できませんでした。時間をおいて再度お試しください。");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadResource();
    return () => {
      cancelled = true;
    };
  }, [kind, endpoint, loginPath, router]);

  return { data, loading, error };
}
