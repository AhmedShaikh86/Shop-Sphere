"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, FormField } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { authService } from "@/services/authService";
import { apiErrorMessage } from "@/lib/api-client";
import { usePageTitle } from "@/hooks/usePageTitle";

const schema = z.object({ email: z.string().email("Enter a valid email address.") });

export default function ForgotPasswordPage() {
  usePageTitle("Forgot Password");

  const [isSent, setIsSent] = useState(false);
  const [serverError, setServerError] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  async function onSubmit(data) {
    setServerError(null);

    try {
      await authService.forgotPassword(data);
      setIsSent(true);
    } catch (error) {
      setServerError(apiErrorMessage(error));
    }
  }

  if (isSent) {
    return (
      <>
        <h1 className="font-serif text-2xl text-foreground">Check your email</h1>
        <p className="mt-3 text-sm text-muted">
          If an account exists for that email, we&apos;ve sent a link to reset your password.
        </p>
        <Link href="/login" className="focus-ring mt-6 inline-block text-sm text-foreground underline">
          Back to login
        </Link>
      </>
    );
  }

  return (
    <>
      <h1 className="font-serif text-2xl text-foreground">Reset your password</h1>
      <p className="mt-2 text-sm text-muted">Enter your email and we&apos;ll send you a reset link.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
        <FormField label="Email" htmlFor="email" error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" {...register("email")} />
        </FormField>
        {serverError && <p className="text-xs text-danger">{serverError}</p>}
        <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
          Send Reset Link
        </Button>
      </form>
    </>
  );
}
