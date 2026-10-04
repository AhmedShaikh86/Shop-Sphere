"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, FormField } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { authService } from "@/services/authService";
import { apiErrorMessage } from "@/lib/api-client";
import { usePageTitle } from "@/hooks/usePageTitle";

const schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters."),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match.",
    path: ["password_confirmation"],
  });

function ResetPasswordForm() {
  usePageTitle("Reset Password");

  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";
  const [serverError, setServerError] = useState(null);
  const [isDone, setIsDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  async function onSubmit(data) {
    setServerError(null);

    try {
      await authService.resetPassword({ ...data, token, email });
      setIsDone(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (error) {
      setServerError(apiErrorMessage(error));
    }
  }

  if (!token || !email) {
    return (
      <p className="text-sm text-muted">
        This reset link is invalid or has expired.{" "}
        <Link href="/forgot-password" className="underline">
          Request a new one
        </Link>
        .
      </p>
    );
  }

  if (isDone) {
    return <p className="text-sm text-muted">Your password has been reset. Redirecting to login…</p>;
  }

  return (
    <>
      <h1 className="font-serif text-2xl text-foreground">Set a new password</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
        <FormField label="New Password" htmlFor="password" error={errors.password?.message}>
          <Input id="password" type="password" autoComplete="new-password" {...register("password")} />
        </FormField>
        <FormField label="Confirm Password" htmlFor="password_confirmation" error={errors.password_confirmation?.message}>
          <Input id="password_confirmation" type="password" autoComplete="new-password" {...register("password_confirmation")} />
        </FormField>
        {serverError && <p className="text-xs text-danger">{serverError}</p>}
        <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
          Reset Password
        </Button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
