import React from "react";
import { Integration } from "@/types";
import { IntegrationCard } from "../components/IntegrationCard";
import { IntegrationPlaceholder } from "../components/IntegrationPlaceholder";

interface IntegrationsTabProps {
  integrations: Integration[];
  onToggle: (id: string) => void;
}

export const IntegrationsTab: React.FC<IntegrationsTabProps> = ({
  integrations,
  onToggle,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
      {integrations.map((integration) => (
        <IntegrationCard
          key={integration.id}
          integration={integration}
          onToggle={onToggle}
        />
      ))}
      <IntegrationPlaceholder />
    </div>
  );
};
