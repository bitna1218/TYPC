import { ApiPaginationResponse, ApiResponse } from '@/types/lcaBackend';
import lcaBackend from '../instances/lcaBackend';

/**
 * GET /api/v1/corp_year
 */
export const getCorpYear = async (id: string) => {
  return await lcaBackend.get('/api/v1/corp_years', {
    params: { id },
  });
};

export type CorpYearListParams = {
  id_corp: string;
  from_year: number;
  to_year: number;
  page?: number; // 페이지 번호
  size?: number; // 페이지 크기
  sort?: string[]; // 정렬 기준
};
export type CorpYearListItem = {
  id: string;
  id_corp: string;
  year: number;
  name_corp: string;
  name_ceo: string;
  no_corp: string;
  biz_type: string;
  post_code: string;
  address: string;
  phone: string;
  desc: string | null;
  created_at: string;
  created_by: string;
  enabled: boolean;
};
/**
 * GET /api/v1/corp_year
 * 연도별 법인 목록 조회
 */
export const getCorpYearListAPI = async (params: CorpYearListParams) => {
  return await lcaBackend
    .get<ApiPaginationResponse<CorpYearListItem>>('/api/v1/corp_years', {
      params,
    })
    .then((response) => response.data);
};

export type CorpYearCreateParams = {
  id_corp: string; // 유저가 속한 법인 ID
  year: number;
  name_corp: string; // 법인명
  name_ceo: string; // 대표자명
  no_corp: string; // 법인등록번호
  biz_type?: string; // 지정업종(대표업종)
  post_code: string; // 우편번호
  address: string; // 주소(법인소재지)
  phone: string; // 법인 전화번호
  desc?: string;
  proc_ems_types: string[]; // 공정배출유무
  created_by: string; // 생성자 ID
};
export type ProcEmsTypesResult = {
  id_corp_year: string;
  created_count: number;
  deleted_count: number;
  total_count: number;
  proc_ems_types: string[];
  updated_at: string;
};
export type CorpYearCreateResult = {
  id_corp_year: string;
  site_name: string;
  created_at: string;
  proc_ems_types_result: ProcEmsTypesResult;
};
/**
 * POST /api/v1/corp_year
 * 연도별 법인 등록
 */
export const createCorpYearAPI = async (data: CorpYearCreateParams) => {
  return await lcaBackend
    .post<ApiResponse<CorpYearCreateResult>>('/api/v1/corp_years', data)
    .then((response) => response.data);
};

export type CorpYearUpdateParams = {
  corp_year_id: string; // 연도별 법인 ID
  name_corp: string;
  name_ceo: string;
  biz_type: string;
  post_code: string;
  address: string;
  phone: string;
  desc: string;
  proc_ems_types: string[];
  updated_by: string;
};
export type CorpYearUpdateResult = {
  id: string;
  name_corp: string;
  name_ceo: string;
  biz_type: string;
  post_code: string;
  address: string;
  phone: string;
  desc: string;
  updated_at: string;
  proc_ems_types_result: ProcEmsTypesResult;
};

/**
 * 연도별 법인 수정
 * PUT /api/v1/corp_year/{corp_year_id}
 */
export const updateCorpYearAPI = async ({
  corp_year_id,
  ...payload
}: CorpYearUpdateParams) => {
  return await lcaBackend
    .put<
      ApiResponse<CorpYearUpdateResult>
    >(`/api/v1/corp_years/${corp_year_id}`, payload)
    .then((response) => response.data);
};

export type CorpYearResult = {
  corp_year: CorpYear;
  proc_ems_types: string[];
  contact_persons: ContactPerson[];
};
export type CorpYear = {
  id: string;
  id_corp: string;
  year: number;
  name_corp: string;
  name_ceo: string;
  no_corp: string;
  biz_type: string;
  post_code: string;
  address: string;
  phone: string;
  desc: string;
  created_at: string;
  created_by: string;
  enabled: boolean;
};
export type ContactPerson = {
  id: string;
  id_corp_year: string;
  person_in_charge: string;
  dept: string;
  position: string;
  phone: string;
  cell_phone: string;
  email: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
};
/**
 * 해당 연도 법인 상세 조회
 * GET /api/v1/corp_year/{corp_year_id}
 */
export const getCorpYearDetailByIdAPI = async (corp_year_id: string) => {
  return await lcaBackend
    .get<ApiResponse<CorpYearResult>>(`/api/v1/corp_years/${corp_year_id}`)
    .then((response) => response.data);
};

export type DeleteYearCorpParams = {
  corp_year_id: string;
  deleted_by: string; // 삭제자 ID
};
export type DeleteYearCorpResult = {
  id: string;
  id_corp: string;
  year: number;
  name_corp: string;
  deleted_at: string;
};
/**
 * 연도별 법인 삭제
 * DELETE /api/v1/corp_year/{corp_year_id}
 */
export const deleteYearCorp = async ({
  corp_year_id,
  deleted_by,
}: DeleteYearCorpParams) => {
  return lcaBackend
    .delete<ApiResponse<DeleteYearCorpResult>>(
      `/api/v1/corp_years/${corp_year_id}`,
      {
        data: { deleted_by },
      },
    )
    .then((response) => response.data);
};
