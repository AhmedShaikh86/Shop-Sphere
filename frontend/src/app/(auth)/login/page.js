"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, FormField } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useLogin } from "@/hooks/useAuth";
import { usePageTitle } from "@/hooks/usePageTitle";

const schema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export default function LoginPage() {
  usePageTitle("Log In");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });
  const login = useLogin();

  return (
    <>
      <h1 className="font-serif text-2xl text-foreground">Welcome back</h1>
      <p className="mt-2 text-sm text-muted">Log in to continue shopping.</p>

      <form onSubmit={handleSubmit((data) => login.mutate(data))} className="mt-6 flex flex-col gap-4">
        <FormField label="Email" htmlFor="email" error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" {...register("email")} />
        </FormField>
        <FormField label="Password" htmlFor="password" error={errors.password?.message}>
          <Input id="password" type="password" autoComplete="current-password" {...register("password")} />
        </FormField>
        <div className="flex justify-end">
          <Link href="/forgot-password" className="focus-ring text-xs text-muted hover:text-foreground">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" isLoading={login.isPending} className="mt-2 w-full">
          Log In
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        New to ShopSphere?{" "}
        <Link href="/register" className="focus-ring text-foreground underline">
          Create an account
        </Link>
      </p>
    </>
  );
}
