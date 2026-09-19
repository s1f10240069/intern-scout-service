"use client";
import { FormEvent, useState } from "react";
import { Button, Field, Input, Textarea } from "@/components/ui";
export type JobFormValues = {
  title: string;
  description: string;
  location: string;
  compensation: string;
  period: string;
  requiredSkills: string;
};
type Props = {
  initialValues?: JobFormValues;
  submitLabel: string;
  onSubmit: (values: JobFormValues) => Promise<void>;
};
const emptyValues: JobFormValues = {
  title: "",
  description: "",
  location: "",
  compensation: "",
  period: "",
  requiredSkills: "",
};
export default function JobForm({ initialValues = emptyValues, submitLabel, onSubmit }: Props) {
  const [values, setValues] = useState(initialValues);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const updateField = (field: keyof JobFormValues, value: string) =>
    setValues((current) => ({ ...current, [field]: value }));
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(values);
    } catch (err) {
      setError(err instanceof Error ? err.message : "求人を保存できませんでした。");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <form className="form-stack" onSubmit={handleSubmit}>
      <Field label="タイトル">
        <Input
          value={values.title}
          onChange={(e) => updateField("title", e.target.value)}
          maxLength={200}
          placeholder="例：Webエンジニア インターン"
          required
        />
      </Field>
      <Field label="仕事内容">
        <Textarea
          value={values.description}
          onChange={(e) => updateField("description", e.target.value)}
          maxLength={10000}
          placeholder="業務内容、得られる経験、チームについて記載しましょう"
          required
        />
      </Field>
      <div className="meta-list">
        <Field label="勤務地">
          <Input
            value={values.location}
            onChange={(e) => updateField("location", e.target.value)}
            maxLength={255}
            placeholder="例：東京都渋谷区 / リモート"
          />
        </Field>
        <Field label="報酬">
          <Input
            value={values.compensation}
            onChange={(e) => updateField("compensation", e.target.value)}
            maxLength={255}
            placeholder="例：時給 1,500円"
          />
        </Field>
        <Field label="期間">
          <Input
            value={values.period}
            onChange={(e) => updateField("period", e.target.value)}
            maxLength={255}
            placeholder="例：3か月〜"
          />
        </Field>
        <Field label="求めるスキル">
          <Input
            value={values.requiredSkills}
            onChange={(e) => updateField("requiredSkills", e.target.value)}
            maxLength={255}
            placeholder="例：TypeScript、React"
          />
        </Field>
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <div className="form-actions">
        <Button type="submit" disabled={submitting}>
          {submitting ? "保存中..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
