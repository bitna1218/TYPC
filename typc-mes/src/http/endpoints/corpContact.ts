import { ApiResponse } from '@/types/lcaBackend';
import lcaBackend from '../instances/lcaBackend';

export type CorpContactListItem = {
  id: string;
  id_corp_year: string;
  person_in_charge: string; // 담당자 이름
  dept: string; // 부서
  position: string; // 직급
  phone: string; // 전화번호
  cell_phone: string; // 휴대폰 번호
  email: string; // 이메일
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
};
/**
 * 선택한 연도의 법인 담당자 목록 조회
 * GET /api/v1/corp_contact/{id_corp_year}
 */
export const getYearCorpContactList = async (id_corp_year: string) => {
  return lcaBackend
    .get<
      ApiResponse<CorpContactListItem[]>
    >(`/api/v1/corp_contact/${id_corp_year}`)
    .then((response) => response.data);
};

export type PostYearCorpContactPayload = {
  id_corp_year: string;
  person_in_charge: string;
  dept: string;
  position?: string;
  phone?: string;
  cell_phone?: string;
  email?: string;
  created_by: string;
};
export type PostYearCorpContactResult = {
  id: string;
  id_corp_year: string;
  person_in_charge: string;
  created_at: string;
};
/**
 * 연도별 법인에 담당자 등록
 * POST /api/v1/corp_contact
 */
export const postYearCorpContact = async (
  payload: PostYearCorpContactPayload,
) => {
  return lcaBackend
    .post<
      ApiResponse<PostYearCorpContactResult>
    >('/api/v1/corp_contact', payload)
    .then((response) => response.data);
};

export type PutYearCorpContactPayload = {
  id: string;
  dept: string;
  position?: string;
  phone?: string;
  cell_phone?: string;
  email?: string;
  updated_by: string;
};
export type PutYearCorpContactResult = {
  id: string;
  id_corp_year: string;
  person_in_charge: string;
  updated_at: string;
};
/**
 * 연도별 법인 담당자 수정
 * PUT /api/v1/corp_contact/{id}
 */
export const putYearCorpContact = async ({
  id,
  ...payload
}: PutYearCorpContactPayload) => {
  return lcaBackend
    .put<
      ApiResponse<PutYearCorpContactResult>
    >(`/api/v1/corp_contact/${id}`, payload)
    .then((response) => response.data);
};

export type DeleteYearCorpContactParams = {
  id: string; // 삭제할 담당자의 ID
  deleted_by: string; // 삭제를 수행한 사용자 ID
};
export type DeleteYearCorpContactResult = {
  id: string;
  id_corp_year: string;
  person_in_charge: string;
  deleted_at: string;
};
/**
 * 연도별 법인 담당자 삭제
 * DELETE /api/v1/corp_contact/{id}
 */
export const deleteYearCorpContact = async ({
  id,
  deleted_by,
}: DeleteYearCorpContactParams) => {
  return lcaBackend
    .delete<ApiResponse<DeleteYearCorpContactResult>>(
      `/api/v1/corp_contact/${id}`,
      {
        data: { deleted_by },
      },
    )
    .then((response) => response.data);
};
