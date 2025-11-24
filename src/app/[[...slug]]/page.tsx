import ClientOnly from "./client";

export function generateStaticParams() {
  return [];
}

export default function Page() {
  return <ClientOnly />;
}
