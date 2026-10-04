"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, FormField } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useSaveAddress } from "@/hooks/useProfile";

const schema = z.object({
  label: z.string().optional(),
  recipient_name: z.string().min(2, "Recipient name is required."),
  phone: z.string().min(5, "Phone number is required."),
  line1: z.string().min(3, "Address line is required."),
  line2: z.string().optional(),
  city: z.string().min(1, "City is required."),
  state: z.string().min(1, "State is required."),
  postal_code: z.string().min(1, "Postal code is required."),
  country: z.string().min(1, "Country is required."),
  is_default: z.boolean().optional(),
});

export function AddressForm({ address, onSaved }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema), defaultValues: address || { country: "United States" } });
  const saveAddress = useSaveAddress();

  function onSubmit(data) {
    saveAddress.mutate(
      { id: address?.id, payload: data },
      { onSuccess: () => onSaved?.() }
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <FormField label="Label (optional)" htmlFor="label">
        <Input id="label" placeholder="Home, Work…" {...register("label")} />
      </FormField>
      <FormField label="Recipient Name" htmlFor="recipient_name" error={errors.recipient_name?.message}>
        <Input id="recipient_name" {...register("recipient_name")} />
      </FormField>
      <FormField label="Phone" htmlFor="phone" error={errors.phone?.message}>
        <Input id="phone" {...register("phone")} />
      </FormField>
      <FormField label="Address Line 1" htmlFor="line1" error={errors.line1?.message}>
        <Input id="line1" {...register("line1")} />
      </FormField>
      <FormField label="Address Line 2 (optional)" htmlFor="line2">
        <Input id="line2" {...register("line2")} />
      </FormField>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="City" htmlFor="city" error={errors.city?.message}>
          <Input id="city" {...register("city")} />
        </FormField>
        <FormField label="State" htmlFor="state" error={errors.state?.message}>
          <Input id="state" {...register("state")} />
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Postal Code" htmlFor="postal_code" error={errors.postal_code?.message}>
          <Input id="postal_code" {...register("postal_code")} />
        </FormField>
        <FormField label="Country" htmlFor="country" error={errors.country?.message}>
          <Input id="country" {...register("country")} />
        </FormField>
      </div>
      <label className="flex items-center gap-2 text-sm text-foreground">
        <input type="checkbox" {...register("is_default")} /> Set as default address
      </label>
      <Button type="submit" isLoading={saveAddress.isPending} className="w-full">
        Save Address
      </Button>
    </form>
  );
}
