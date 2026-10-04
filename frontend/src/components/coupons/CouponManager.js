"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input, Select, FormField } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/Spinner";
import { Tag } from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/format";

const schema = z.object({
  code: z.string().min(3, "Code is required.").toUpperCase(),
  type: z.enum(["percentage", "fixed"]),
  value: z.coerce.number().positive("Value must be greater than 0."),
  min_order_amount: z.union([z.coerce.number().positive(), z.literal("")]).optional(),
  max_uses: z.union([z.coerce.number().int().positive(), z.literal("")]).optional(),
  max_uses_per_user: z.union([z.coerce.number().int().positive(), z.literal("")]).optional(),
  expires_at: z.string().optional(),
  is_active: z.boolean().optional(),
});

/** Shared by /seller/coupons and /admin/coupons — only the data hooks differ. */
export function CouponManager({ useCoupons, useSaveCoupon, useDeleteCoupon }) {
  const { data: coupons, isLoading } = useCoupons();
  const saveCoupon = useSaveCoupon();
  const deleteCoupon = useDeleteCoupon();

  const [editingCoupon, setEditingCoupon] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { type: "percentage", is_active: true } });

  function openNew() {
    setEditingCoupon(null);
    reset({ type: "percentage", is_active: true, code: "", value: "" });
    setIsModalOpen(true);
  }

  function openEdit(coupon) {
    setEditingCoupon(coupon);
    reset({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      min_order_amount: coupon.min_order_amount || "",
      max_uses: coupon.max_uses || "",
      max_uses_per_user: coupon.max_uses_per_user || "",
      expires_at: coupon.expires_at?.slice(0, 10) || "",
      is_active: coupon.is_active,
    });
    setIsModalOpen(true);
  }

  function onSubmit(data) {
    const payload = {
      ...data,
      min_order_amount: data.min_order_amount || null,
      max_uses: data.max_uses || null,
      max_uses_per_user: data.max_uses_per_user || null,
      expires_at: data.expires_at || null,
    };

    saveCoupon.mutate({ id: editingCoupon?.id, payload }, { onSuccess: () => setIsModalOpen(false) });
  }

  if (isLoading) return <Spinner />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl text-foreground">Coupons</h1>
        <Button onClick={openNew}>
          <Plus className="h-4 w-4" /> New Coupon
        </Button>
      </div>

      {coupons?.length === 0 && <EmptyState icon={Tag} title="No coupons yet" description="Create a coupon to offer discounts." />}

      <div className="flex flex-col gap-3">
        {coupons?.map((coupon) => (
          <div key={coupon.id} className="flex flex-wrap items-center justify-between gap-3 border border-border p-4 text-sm">
            <div>
              <p className="font-medium text-foreground">{coupon.code}</p>
              <p className="text-muted">
                {coupon.type === "percentage" ? `${coupon.value}% off` : `${formatCurrency(coupon.value)} off`}
                {coupon.min_order_amount ? ` · Min order ${formatCurrency(coupon.min_order_amount)}` : ""}
                {coupon.expires_at ? ` · Expires ${formatDate(coupon.expires_at)}` : ""}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={coupon.is_active ? "success" : "neutral"}>{coupon.is_active ? "Active" : "Inactive"}</Badge>
              <button onClick={() => openEdit(coupon)} className="focus-ring text-muted hover:text-foreground">
                <Pencil className="h-4 w-4" />
              </button>
              <button onClick={() => setDeletingId(coupon.id)} className="focus-ring text-muted hover:text-danger">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCoupon ? "Edit Coupon" : "New Coupon"}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField label="Code" htmlFor="code" error={errors.code?.message}>
            <Input id="code" {...register("code")} />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Type" htmlFor="type">
              <Select id="type" {...register("type")}>
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </Select>
            </FormField>
            <FormField label="Value" htmlFor="value" error={errors.value?.message}>
              <Input id="value" type="number" step="0.01" {...register("value")} />
            </FormField>
          </div>
          <FormField label="Minimum Order Amount (optional)" htmlFor="min_order_amount">
            <Input id="min_order_amount" type="number" step="0.01" {...register("min_order_amount")} />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Max Total Uses (optional)" htmlFor="max_uses">
              <Input id="max_uses" type="number" {...register("max_uses")} />
            </FormField>
            <FormField label="Max Uses Per User (optional)" htmlFor="max_uses_per_user">
              <Input id="max_uses_per_user" type="number" {...register("max_uses_per_user")} />
            </FormField>
          </div>
          <FormField label="Expires At (optional)" htmlFor="expires_at">
            <Input id="expires_at" type="date" {...register("expires_at")} />
          </FormField>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" {...register("is_active")} /> Active
          </label>
          <Button type="submit" isLoading={saveCoupon.isPending} className="w-full">
            Save Coupon
          </Button>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={() => deleteCoupon.mutate(deletingId, { onSuccess: () => setDeletingId(null) })}
        title="Delete this coupon?"
        confirmLabel="Delete"
        isLoading={deleteCoupon.isPending}
      />
    </div>
  );
}
