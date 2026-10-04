"use client";

import { CouponManager } from "@/components/coupons/CouponManager";
import { useSellerCoupons, useSaveSellerCoupon, useDeleteSellerCoupon } from "@/hooks/useSeller";

export default function SellerCouponsPage() {
  return (
    <CouponManager
      useCoupons={useSellerCoupons}
      useSaveCoupon={useSaveSellerCoupon}
      useDeleteCoupon={useDeleteSellerCoupon}
    />
  );
}
