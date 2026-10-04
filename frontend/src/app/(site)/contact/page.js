"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, MapPin, Phone } from "lucide-react";
import { Input, Textarea, FormField } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { usePageTitle } from "@/hooks/usePageTitle";

const schema = z.object({
  name: z.string().min(2, "Name is required."),
  email: z.string().email("Enter a valid email address."),
  message: z.string().min(10, "Message should be at least 10 characters."),
});

export default function ContactPage() {
  usePageTitle("Contact");

  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  async function onSubmit() {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSubmitted(true);
    reset();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-xs uppercase tracking-widest text-muted">Contact</p>
      <h1 className="mt-3 font-serif text-4xl text-foreground">We&apos;d Love to Hear From You</h1>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <div>
          <div className="flex flex-col gap-4 text-sm text-muted">
            <p className="flex items-center gap-3">
              <Mail className="h-4 w-4" /> support@shopsphere.example
            </p>
            <p className="flex items-center gap-3">
              <Phone className="h-4 w-4" /> +1 (555) 010-1234
            </p>
            <p className="flex items-center gap-3">
              <MapPin className="h-4 w-4" /> 128 Market Street, Austin, TX
            </p>
          </div>
          <p className="mt-6 text-sm text-muted">Our support team responds within one business day.</p>
        </div>

        <div>
          {isSubmitted ? (
            <p className="text-sm text-success">Thanks for reaching out — we&apos;ll be in touch shortly.</p>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <FormField label="Name" htmlFor="name" error={errors.name?.message}>
                <Input id="name" {...register("name")} />
              </FormField>
              <FormField label="Email" htmlFor="email" error={errors.email?.message}>
                <Input id="email" type="email" {...register("email")} />
              </FormField>
              <FormField label="Message" htmlFor="message" error={errors.message?.message}>
                <Textarea id="message" rows={5} {...register("message")} />
              </FormField>
              <Button type="submit" isLoading={isSubmitting} className="w-fit">
                Send Message
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
