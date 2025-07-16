import { dummyUser } from '@/data/dummy';
import { getCorpYearListAPI } from '@/http/endpoints/corpYear';
import { useQuery } from '@tanstack/react-query';

export default function useCorpYear() {
  const currentYear = new Date().getFullYear();
  const {
    data: allCorpYearListResponse,
    isLoading,
    isError,
    refetch: refetchCorpYearList,
  } = useQuery({
    queryKey: ['getCorpYearListAll', dummyUser.id_corp, currentYear],
    queryFn: () =>
      getCorpYearListAPI({
        id_corp: dummyUser.id_corp, // TODO: 향후 인증기능이 추가되면 인증된 사용자 정보로 변경
        from_year: currentYear - 20,
        to_year: currentYear,
        size: 500,
      }),
    enabled: !!dummyUser.id_corp,
  });

  return {
    allCorpYearListResponse,
    isLoading,
    isError,
    refetchCorpYearList,
  };
}
