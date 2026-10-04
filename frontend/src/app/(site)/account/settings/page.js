"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useUpdateProfile } from "@/hooks/useProfile";
import { authService } from "@/services/authService";
import { Input, FormField } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToastStore } from "@/store/toastStore";
import { apiErrorMessage } from "@/lib/api-client";

const profileSchema = z.object({
  name: z.string().min(2, "Name is required."),
  email: z.string().email("Enter a valid email address."),
  phone: z.string().optional(),
});

const passwordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match.",
    path: ["password_confirmation"],
  });

export default function SettingsPage() {
  const { user } = useAuth();
  const updateProfile = useUpdateProfile();
  const showToast = useToastStore((state) => state.showToast);

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name, email: user?.email, phone: user?.phone || "" },
  });

  const passwordForm = useForm({ resolver: zodResolver(passwordSchema) });

  const changePassword = useMutation({
    mutationFn: authService.changePassword,
    onSuccess: () => {
      showToast("Password changed.");
      passwordForm.reset();
    },
    onError: (error) => showToast(apiErrorMessage(error), "error"),
  });

  return (
    <div className="flex flex-col gap-10">
      <section>
        <h2 className="mb-4 font-serif text-lg text-foreground">Personal Details</h2>
        <form onSubmit={profileForm.handleSubmit((data) => updateProfile.mutate(data))} className="flex max-w-md flex-col gap-4">
          <FormField label="Full Name" htmlFor="name" error={profileForm.formState.errors.name?.message}>
            <Input id="name" {...profileForm.register("name")} />
          </FormField>
          <FormField label="Email" htmlFor="email" error={profileForm.formState.errors.email?.message}>
            <Input id="email" type="email" {...profileForm.register("email")} />
          </FormField>
          <FormField label="Phone" htmlFor="phone">
            <Input id="phone" {...profileForm.register("phone")} />
          </FormField>
          <Button type="submit" isLoading={updateProfile.isPending} className="w-fit">
            Save Changes
          </Button>
        </form>
      </section>

      <section>
        <h2 className="mb-4 font-serif text-lg text-foreground">Change Password</h2>
        <form onSubmit={passwordForm.handleSubmit((data) => changePassword.mutate(data))} className="flex max-w-md flex-col gap-4">
          <FormField label="Current Password" htmlFor="current_password" error={passwordForm.formState.errors.current_password?.message}>
            <Input id="current_password" type="password" {...passwordForm.register("current_password")} />
          </FormField>
          <FormField label="New Password" htmlFor="password" error={passwordForm.formState.errors.password?.message}>
            <Input id="password" type="password" {...passwordForm.register("password")} />
          </FormField>
          <FormField label="Confirm New Password" htmlFor="password_confirmation" error={passwordForm.formState.errors.password_confirmation?.message}>
            <Input id="password_confirmation" type="password" {...passwordForm.register("password_confirmation")} />
          </FormField>
          <Button type="submit" isLoading={changePassword.isPending} className="w-fit">
            Update Password
          </Button>
        </form>
      </section>
    </div>
  );
}
