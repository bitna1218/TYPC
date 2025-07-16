import { useQuery } from '@tanstack/react-query';
import {
  getCodesByGroup,
  GetCodesByGroupParams,
} from '@/http/endpoints/commonCode';

export const useCommonCodesByGroup = (params: GetCodesByGroupParams) => {
  const {
    data: commonCodesResponse,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['getCodesByGroup', params],
    queryFn: () => getCodesByGroup(params),
    enabled: !!params.group_code, // group_code가 있을 때만 쿼리 실행
  });

  return {
    commonCodesResponse,
    isLoading,
    isError,
    refetch,
  };
};
