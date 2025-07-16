import MainLayout from '@/components/layout/MainLayout';

export default function AuthPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
