import lcaBackend from '../instances/lcaBackend';

export type CommonCode = {
  group_code: string;
  detail_code: string;
  code_name: string;
  code_order: number;
  parent_code: string | null;
  description: string | null;
  enabled: boolean;
};

export type GetCodesByGroupParams = {
  group_code: string; // Path Parameter
  parent_code?: string; // Query Parameter
  enabled?: boolean; // Query Parameter
};

export type GetCodesByGroupResponse = CommonCode[];

export const getCodesByGroup = async ({
  group_code,
  ...params
}: GetCodesByGroupParams): Promise<GetCodesByGroupResponse> => {
  return await lcaBackend
    .get<GetCodesByGroupResponse>(
      `/api/v1/common-codes/groups/${group_code}/codes`,
      {
        params,
      },
    )
    .then((res) => res.data);
};
