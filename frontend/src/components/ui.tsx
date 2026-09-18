import Link from "next/link";
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
};

export function Button({ className = "", variant = "primary", ...props }: ButtonProps) {
  return <button className={`button button--${variant} ${className}`} {...props} />;
}

export function ButtonLink({ href, children, variant = "primary", className = "" }: { href: string; children: ReactNode; variant?: "primary" | "secondary" | "ghost"; className?: string }) {
  return <Link href={href} className={`button button--${variant} ${className}`}>{children}</Link>;
}

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`input ${className}`} {...props} />;
}

export function Textarea({ className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`input textarea ${className}`} {...props} />;
}

export function Card({ className = "", children }: { className?: string; children: ReactNode }) {
  return <section className={`card ${className}`}>{children}</section>;
}

export function Badge({ children }: { children: ReactNode }) {
  return <span className="badge">{children}</span>;
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return <label className="field"><span className="field__label">{label}</span>{children}{hint && <span className="field__hint">{hint}</span>}</label>;
}
