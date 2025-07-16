'use client';

import { useSearchParams } from 'next/navigation';
import BusinessSiteDetail from './BusinessSiteDetailPage';

export default function BusinessSiteDetailWithParams() {
  const searchParams = useSearchParams();
  const siteId = searchParams.get('id');

  return <BusinessSiteDetail siteId={siteId || undefined} />;
}
