"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, FormField } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useRegister } from "@/hooks/useAuth";
import { usePageTitle } from "@/hooks/usePageTitle";

const schema = z
  .object({
    name: z.string().min(2, "Enter your full name."),
    email: z.string().email("Enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    password_confirmation: z.string(),
    role: z.enum(["customer", "seller"]),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match.",
    path: ["password_confirmation"],
  });

export default function RegisterPage() {
  usePageTitle("Create Account");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { role: "customer" } });
  const registerUser = useRegister();

  return (
    <>
      <h1 className="font-serif text-2xl text-foreground">Create your account</h1>
      <p className="mt-2 text-sm text-muted">Join ShopSphere to start shopping or selling.</p>

      <form onSubmit={handleSubmit((data) => registerUser.mutate(data))} className="mt-6 flex flex-col gap-4">
        <FormField label="Full Name" htmlFor="name" error={errors.name?.message}>
          <Input id="name" autoComplete="name" {...register("name")} />
        </FormField>
        <FormField label="Email" htmlFor="email" error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" {...register("email")} />
        </FormField>
        <FormField label="Password" htmlFor="password" error={errors.password?.message}>
          <Input id="password" type="password" autoComplete="new-password" {...register("password")} />
        </FormField>
        <FormField label="Confirm Password" htmlFor="password_confirmation" error={errors.password_confirmation?.message}>
          <Input id="password_confirmation" type="password" autoComplete="new-password" {...register("password_confirmation")} />
        </FormField>

        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-medium text-foreground">I want to</legend>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="radio" value="customer" {...register("role")} /> Shop on ShopSphere
          </label>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="radio" value="seller" {...register("role")} /> Sell on ShopSphere
          </label>
        </fieldset>

        <Button type="submit" isLoading={registerUser.isPending} className="mt-2 w-full">
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="focus-ring text-foreground underline">
          Log in
        </Link>
      </p>
    </>
  );
}
