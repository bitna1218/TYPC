import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const BusinessSiteDetailWithParams = dynamic(
  () => import('./BusinessSiteDetailWithParams')
);

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BusinessSiteDetailWithParams />
    </Suspense>
  );
}
