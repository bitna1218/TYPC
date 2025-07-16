'use client';

import DataDogProvider from './DataDogProvider';

export type ProvidersProps = {
  children: React.ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  return (
    <DataDogProvider>{children}</DataDogProvider>
  );
}
