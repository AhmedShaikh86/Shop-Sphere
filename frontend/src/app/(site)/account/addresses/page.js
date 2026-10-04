"use client";

import { useState } from "react";
import { MapPin, Pencil, Trash2 } from "lucide-react";
import { useAddresses, useDeleteAddress } from "@/hooks/useProfile";
import { AddressForm } from "@/components/account/AddressForm";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/Spinner";

export default function AddressesPage() {
  const { data: addresses, isLoading } = useAddresses();
  const deleteAddress = useDeleteAddress();
  const [editingAddress, setEditingAddress] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  function openNew() {
    setEditingAddress(null);
    setIsModalOpen(true);
  }

  function openEdit(address) {
    setEditingAddress(address);
    setIsModalOpen(true);
  }

  if (isLoading) return <Spinner />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-serif text-lg text-foreground">Saved Addresses</h2>
        <Button size="sm" onClick={openNew}>
          Add Address
        </Button>
      </div>

      {addresses?.length === 0 && (
        <EmptyState icon={MapPin} title="No addresses saved" description="Add an address to speed up checkout." />
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {addresses?.map((address) => (
          <div key={address.id} className="border border-border p-4 text-sm">
            <div className="mb-2 flex items-center justify-between">
              <p className="font-medium text-foreground">{address.label || "Address"}</p>
              {address.is_default && <Badge variant="accent">Default</Badge>}
            </div>
            <p className="text-muted">{address.recipient_name}</p>
            <p className="text-muted">
              {address.line1}, {address.city}, {address.state} {address.postal_code}
            </p>
            <p className="text-muted">{address.country}</p>
            <div className="mt-3 flex gap-3">
              <button onClick={() => openEdit(address)} className="focus-ring flex items-center gap-1 text-xs text-foreground underline">
                <Pencil className="h-3 w-3" /> Edit
              </button>
              <button onClick={() => setDeletingId(address.id)} className="focus-ring flex items-center gap-1 text-xs text-danger underline">
                <Trash2 className="h-3 w-3" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingAddress ? "Edit Address" : "Add Address"}>
        <AddressForm address={editingAddress} onSaved={() => setIsModalOpen(false)} />
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={() => deleteAddress.mutate(deletingId, { onSuccess: () => setDeletingId(null) })}
        title="Delete this address?"
        confirmLabel="Delete"
        isLoading={deleteAddress.isPending}
      />
    </div>
  );
}
