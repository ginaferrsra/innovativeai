export const metadata = {
  title: 'LexisAI Studio',
  description: 'Content management for LexisAI legal platform',
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
