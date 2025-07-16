import { useEffect, useMemo, useState } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import ContactSelectionModal from './ContactSelectionModal';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getYearCorpContactList,
  postYearCorpContact,
  PostYearCorpContactPayload,
  putYearCorpContact,
  PutYearCorpContactPayload,
  CorpContactListItem,
  deleteYearCorpContact,
  DeleteYearCorpContactParams,
} from '@/http/endpoints/corpContact';
import { dummyUser } from '@/data/dummy';
import { FaPen } from 'react-icons/fa6';
import useToastMessage from '@/hooks/useToastMessage';
import { AxiosError } from 'axios';

// 담당자 인터페이스
export interface Contact {
  id: string;
  name: string;
  department: string;
  position: string;
  phone: string;
  mobile: string;
  email: string;
  isSaved: boolean;
  isNew?: boolean;
}

export type ContactFormData = Omit<Contact, 'id' | 'isSaved' | 'isNew'>;

interface ContactInfoSectionProps {
  id_corp_year?: string; // 법인 연도 ID
  setIsContactInfoSaved: (value: boolean) => void; // 법인 정보 저장 상태 업데이트 함수
}

export default function ContactInfoSection({
  id_corp_year,
  setIsContactInfoSaved,
}: ContactInfoSectionProps) {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToastMessage();
  const [addOrEditContactModalTitle, setAddOrEditContactModalTitle] =
    useState<string>('담당자 등록');
  const [selectedContactForEdit, setSelectedContactForEdit] =
    useState<CorpContactListItem | null>(null);

  const { data: contactsData, refetch: refetchContacts } = useQuery({
    queryKey: ['getYearCorpContactList', id_corp_year],
    queryFn: () => {
      if (!id_corp_year) {
        return;
      }
      return getYearCorpContactList(id_corp_year);
    },
    enabled: !!id_corp_year,
  });

  // 담당자 목록
  const contactsCorpYear = useMemo(
    () => contactsData?.result || [],
    [contactsData],
  );

  const createContactMutation = useMutation({
    mutationFn: (payload: PostYearCorpContactPayload) =>
      postYearCorpContact(payload),
    onSuccess: () => {
      toast.success('담당자가 성공적으로 등록되었습니다.');
      queryClient.invalidateQueries({
        queryKey: ['getYearCorpContactList', id_corp_year],
      });
      setIsContactModalOpen(false); // Close modal on success
      setSelectedContactForEdit(null); // Reset selected contact
      refetchContacts(); // Refetch contacts to update the list
    },
    onError: (error) => {
      toast.error(`담당자 등록 중 오류가 발생했습니다`, error as AxiosError);
    },
  });

  const updateContactMutation = useMutation({
    mutationFn: (payload: PutYearCorpContactPayload) =>
      putYearCorpContact(payload),
    onSuccess: () => {
      toast.success('담당자 정보가 성공적으로 수정되었습니다.');
      queryClient.invalidateQueries({
        queryKey: ['getYearCorpContactList', id_corp_year],
      });
      setIsContactModalOpen(false); // Close modal on success
      setSelectedContactForEdit(null); // Reset selected contact
      refetchContacts(); // Refetch contacts to update the list
    },
    onError: (error) => {
      toast.error(
        `담당자 정보 수정 중 오류가 발생했습니다`,
        error as AxiosError,
      );
    },
  });

  const deleteContactMutation = useMutation({
    mutationFn: (payload: DeleteYearCorpContactParams) =>
      deleteYearCorpContact(payload),
    onSuccess: () => {
      toast.success('담당자가 성공적으로 삭제되었습니다.');
      queryClient.invalidateQueries({
        queryKey: ['getYearCorpContactList', id_corp_year],
      });
      refetchContacts(); // Refetch contacts to update the list
    },
    onError: (error) => {
      toast.error(`담당자 삭제 중 오류가 발생했습니다`, error as AxiosError);
    },
  });

  useEffect(() => {
    if (contactsCorpYear.length > 0) {
      setIsContactInfoSaved(true);
    } else {
      setIsContactInfoSaved(false);
    }
  }, [contactsCorpYear, setIsContactInfoSaved]);

  // 새 담당자 추가
  const handleAddContact = () => {
    if (!id_corp_year) {
      alert('법인정보를 먼저 저장해주세요.');
      return;
    }
    setSelectedContactForEdit(null);
    setAddOrEditContactModalTitle('담당자 등록');
    setIsContactModalOpen(true);
  };

  // 담당자 수정
  const handleEditContact = (contactId: string) => {
    const contactToEdit = contactsCorpYear.find(
      (contact) => contact.id === contactId,
    );
    if (contactToEdit) {
      setSelectedContactForEdit(contactToEdit);
      setAddOrEditContactModalTitle('담당자 수정');
      setIsContactModalOpen(true);
    } else {
      toast.error('선택된 담당자 정보를 찾을 수 없습니다.');
    }
  };

  // 담당자 저장 핸들러 (생성 및 수정)
  const handleSaveContact = (formData: ContactFormData) => {
    if (!id_corp_year) {
      toast.error('법인 연도 ID가 없습니다. 먼저 법인 정보를 저장해주세요.');
      return;
    }

    if (selectedContactForEdit) {
      // 수정 모드
      const payload: PutYearCorpContactPayload = {
        id: selectedContactForEdit.id,
        dept: formData.department,
        position: formData.position,
        phone: formData.phone,
        cell_phone: formData.mobile,
        email: formData.email,
        updated_by: dummyUser.id,
      };
      updateContactMutation.mutate(payload);
    } else {
      // 생성 모드
      const payload: PostYearCorpContactPayload = {
        id_corp_year,
        person_in_charge: formData.name,
        dept: formData.department,
        position: formData.position,
        phone: formData.phone,
        cell_phone: formData.mobile,
        email: formData.email,
        created_by: dummyUser.id,
      };
      createContactMutation.mutate(payload);
    }
  };

  // 담당자 삭제
  const handleDeleteContact = (contactId: string) => {
    if (window.confirm('정말로 이 담당자를 삭제하시겠습니까?')) {
      if (!id_corp_year) {
        toast.error('법인 연도 ID가 없습니다.');
        return;
      }
      const payload: DeleteYearCorpContactParams = {
        id: contactId,
        deleted_by: dummyUser.id,
      };
      deleteContactMutation.mutate(payload);
    }
  };

  const mapContactToFormData = (
    contact: CorpContactListItem | null,
  ): ContactFormData | undefined => {
    if (!contact) return undefined;
    return {
      name: contact.person_in_charge,
      department: contact.dept,
      position: contact.position || '',
      phone: contact.phone || '',
      mobile: contact.cell_phone || '',
      email: contact.email || '',
    };
  };

  return (
    <div className="mb-8 overflow-hidden rounded-lg bg-white shadow">
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-4">
        <h3 className="font-semibold text-gray-700">연락처 정보</h3>
      </div>

      <div className="space-y-6 p-6">
        {/* 기본정보 저장 안내 메시지 */}
        {!id_corp_year && (
          <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <div className="flex items-center">
              <div className="mr-3 text-yellow-600">⚠️</div>
              <div className="text-sm text-yellow-800">
                <strong>법인정보를 먼저 저장해주세요.</strong>
                <br />
                법인정보가 저장된 후에 담당자 정보를 입력할 수 있습니다.
              </div>
            </div>
          </div>
        )}

        {/* 담당자 목록 */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-lg font-medium text-gray-800">담당자 목록</h4>
            <button
              type="button"
              onClick={handleAddContact}
              disabled={!id_corp_year}
              className={`flex items-center rounded-md px-4 py-2 ${
                id_corp_year
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'cursor-not-allowed bg-gray-300 text-gray-500'
              }`}
              title={
                !id_corp_year
                  ? '법인정보를 먼저 저장해주세요'
                  : '새 담당자 추가'
              }
            >
              <FaPlus className="mr-2" />새 담당자 추가
            </button>
          </div>

          {contactsCorpYear.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      성명
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      부서
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      직급
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      연락처
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      액션
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {contactsCorpYear.map((contact) => {
                    return (
                      <tr
                        key={contact.id}
                        className={`cursor-pointer bg-blue-50 hover:bg-gray-50`}
                      >
                        <td className="whitespace-nowrap px-4 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {contact.person_in_charge}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                          {contact.dept || '-'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                          {contact.position || '-'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                          <div>{contact.phone || '-'}</div>
                          {contact.email && (
                            <div className="text-xs text-gray-400">
                              {contact.email}
                            </div>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm font-medium">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditContact(contact.id);
                            }}
                            className="mr-2 text-gray-500 hover:text-blue-500"
                            title="수정"
                          >
                            <FaPen />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteContact(contact.id);
                            }}
                            className="text-gray-500 hover:text-blue-500"
                            title="삭제"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              {id_corp_year
                ? '등록된 담당자가 없습니다. 새 담당자를 추가해주세요.'
                : '법인정보를 저장한 후 담당자를 등록할 수 있습니다.'}
            </div>
          )}
        </div>
      </div>

      {/* 담당자 선택 모달 */}
      <ContactSelectionModal
        title={addOrEditContactModalTitle}
        isOpen={isContactModalOpen}
        onClose={() => {
          setIsContactModalOpen(false);
          setSelectedContactForEdit(null); // Reset on close
        }}
        onClickSave={handleSaveContact}
        initialData={mapContactToFormData(selectedContactForEdit)}
      />
    </div>
  );
}
