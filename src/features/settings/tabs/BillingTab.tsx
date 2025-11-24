import React from "react";
import { PlanTier } from "@/types";
import { PlanCard } from "../widgets/PlanCard";
import { PaymentMethodCard } from "../widgets/PaymentMethodCard";

interface BillingTabProps {
  userPlan: PlanTier;
  onOpenUpgrade: () => void;
}

export const BillingTab: React.FC<BillingTabProps> = ({
  userPlan,
  onOpenUpgrade,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PlanCard userPlan={userPlan} onOpenUpgrade={onOpenUpgrade} />
      <PaymentMethodCard />
    </div>
  );
};
