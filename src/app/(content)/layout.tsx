export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Future: Add content-specific toolbar or breadcrumbs here */}
      {children}
    </>
  );
}
