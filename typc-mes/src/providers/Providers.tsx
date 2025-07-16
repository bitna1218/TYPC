'use client';

import DataDogProvider from './DataDogProvider';
import ReactQueryProvider from './ReactQueryProvider';
import ToastifyContainer from './ToastifyContainer';

export type ProvidersProps = {
  children: React.ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  return (
    <ReactQueryProvider>
      <DataDogProvider>
        {children}
        <ToastifyContainer />
      </DataDogProvider>
    </ReactQueryProvider>
  );
}
