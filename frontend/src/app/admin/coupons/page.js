"use client";

import { CouponManager } from "@/components/coupons/CouponManager";
import { useAdminCoupons, useSaveAdminCoupon, useDeleteAdminCoupon } from "@/hooks/useAdmin";

export default function AdminCouponsPage() {
  return (
    <CouponManager
      useCoupons={useAdminCoupons}
      useSaveCoupon={useSaveAdminCoupon}
      useDeleteCoupon={useDeleteAdminCoupon}
    />
  );
}
