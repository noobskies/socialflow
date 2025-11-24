import { useState } from "react";
import { ShortLink, BioPageConfig } from "@/types";
import { MOCK_LINKS, INITIAL_BIO_CONFIG } from "@/utils/constants";

export function useLinkManager() {
  const [activeTab, setActiveTab] = useState<"shortener" | "bio" | "leads">(
    "shortener"
  );
  const [links, setLinks] = useState<ShortLink[]>(MOCK_LINKS);
  const [bioConfig, setBioConfig] = useState<BioPageConfig>(INITIAL_BIO_CONFIG);

  return {
    activeTab,
    setActiveTab,
    links,
    setLinks,
    bioConfig,
    setBioConfig,
  };
}
