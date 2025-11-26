import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OAuth - SocialFlow",
  description: "OAuth authentication flow",
};

export default function OAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
