import { AppShell } from "@/components/AppShell";

export function LoadingState() {
  return (
    <AppShell>
      <div className="state-card" role="status">
        <span className="spinner" />
        読み込み中...
      </div>
    </AppShell>
  );
}
export function ErrorState({ message }: { message: string }) {
  return (
    <AppShell>
      <div className="state-card state-card--error" role="alert">
        {message}
      </div>
    </AppShell>
  );
}
