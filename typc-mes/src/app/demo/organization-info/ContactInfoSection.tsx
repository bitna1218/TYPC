import { useState } from 'react';
import { FaSave, FaSearch, FaPlus, FaTrash } from 'react-icons/fa';
import ContactSelectionModal from './ContactSelectionModal';

// 담당자 인터페이스
interface Contact {
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

interface ContactInfoSectionProps {
  contacts: Contact[];
  setContacts: (contacts: Contact[]) => void;
  onSave: (contacts: Contact[]) => void;
  isBasicInfoSaved: boolean; // 법인정보 저장 여부
  companyName: string; // 법인명
}

// 담당자 조회용 인터페이스
interface ContactSearchResult {
  id: string;
  name: string;
  department: string;
  position: string;
  phone: string;
  mobile: string;
  email: string;
}

export default function ContactInfoSection({
  contacts,
  setContacts,
  onSave,
  isBasicInfoSaved,
  companyName,
}: ContactInfoSectionProps) {
  const [selectedContactIndex, setSelectedContactIndex] = useState<
    number | null
  >(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  // 새 담당자 추가
  const handleAddContact = () => {
    if (!isBasicInfoSaved) {
      alert('법인정보를 먼저 저장해주세요.');
      return;
    }

    const newContact: Contact = {
      id: `new_${Date.now()}`,
      name: '',
      department: '',
      position: '',
      phone: '',
      mobile: '',
      email: '',
      isSaved: false,
      isNew: true,
    };

    const updatedContacts = [...contacts, newContact];
    setContacts(updatedContacts);
    setSelectedContactIndex(updatedContacts.length - 1);
    setEditingContact({ ...newContact });
  };

  // 담당자 삭제
  const handleDeleteContact = (index: number) => {
    const contactToDelete = contacts[index];

    if (
      window.confirm(
        `${contactToDelete.name || '새 담당자'}를 삭제하시겠습니까?`
      )
    ) {
      const updatedContacts = contacts.filter((_, i) => i !== index);
      setContacts(updatedContacts);

      // 선택된 담당자가 삭제된 경우 선택 해제
      if (selectedContactIndex === index) {
        setSelectedContactIndex(null);
        setEditingContact(null);
      } else if (
        selectedContactIndex !== null &&
        selectedContactIndex > index
      ) {
        setSelectedContactIndex(selectedContactIndex - 1);
      }
    }
  };

  // 담당자 선택
  const handleSelectContact = (index: number) => {
    setSelectedContactIndex(index);
    setEditingContact({ ...contacts[index] });
  };

  // 편집 중인 담당자 변경사항을 실시간으로 contacts 배열에 반영
  const handleEditingContactChange = (field: keyof Contact, value: string) => {
    if (editingContact && selectedContactIndex !== null) {
      const updatedContact = {
        ...editingContact,
        [field]: value,
        isSaved: false, // 변경사항이 있으면 저장되지 않은 상태로 표시
      };
      setEditingContact(updatedContact);

      // contacts 배열도 동시에 업데이트
      const updatedContacts = [...contacts];
      updatedContacts[selectedContactIndex] = updatedContact;
      setContacts(updatedContacts);
    }
  };

  // 담당자 조회 결과 선택
  const handleContactSearchSelect = (searchResult: ContactSearchResult) => {
    if (editingContact) {
      const updatedContact = {
        ...editingContact,
        name: searchResult.name,
        department: searchResult.department,
        position: searchResult.position,
        phone: searchResult.phone,
        mobile: searchResult.mobile,
        email: searchResult.email,
        isSaved: false, // 변경사항이 있으므로 저장되지 않은 상태로 표시
      };
      setEditingContact(updatedContact);

      // contacts 배열도 동시에 업데이트
      if (selectedContactIndex !== null) {
        const updatedContacts = [...contacts];
        updatedContacts[selectedContactIndex] = updatedContact;
        setContacts(updatedContacts);
      }
    }
  };

  // 전체 저장
  const handleSaveAll = () => {
    if (!isBasicInfoSaved) {
      alert('법인정보를 먼저 저장해주세요.');
      return;
    }

    // 최소 1명의 담당자가 있는지 확인
    if (contacts.length === 0) {
      alert('최소 1명의 담당자를 등록해주세요.');
      return;
    }

    // 모든 담당자 필수 항목 검증
    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];
      if (!contact.name.trim()) {
        alert(`${i + 1}번째 담당자의 성명을 입력해주세요.`);
        return;
      }
    }

    // 모든 담당자를 저장된 상태로 변경
    const savedContacts = contacts.map((contact) => ({
      ...contact,
      isSaved: true,
      isNew: false,
    }));

    setContacts(savedContacts);

    // 현재 편집 중인 담당자도 업데이트
    if (editingContact && selectedContactIndex !== null) {
      setEditingContact({
        ...editingContact,
        isSaved: true,
        isNew: false,
      });
    }

    onSave(savedContacts);
  };

  // 담당자 상태 표시
  const getContactStatus = (contact: Contact) => {
    if (contact.isNew) {
      return (
        <span className='text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full'>
          신규
        </span>
      );
    }
    if (!contact.isSaved) {
      return (
        <span className='text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full'>
          수정중
        </span>
      );
    }
    return (
      <span className='text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full'>
        저장됨
      </span>
    );
  };

  return (
    <div className='bg-white rounded-lg shadow overflow-hidden mb-8'>
      <div className='border-b border-gray-200 p-4 bg-gray-50 flex justify-between items-center'>
        <h3 className='font-semibold text-gray-700'>연락처 정보</h3>
        <div className='flex items-center gap-2'>
          <button
            type='button'
            onClick={handleSaveAll}
            disabled={!isBasicInfoSaved}
            className={`px-3 py-1.5 rounded-md text-sm flex items-center ${
              !isBasicInfoSaved
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                : contacts.some(contact => !contact.isSaved)
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gray-100 text-gray-500'
            }`}
            title={!isBasicInfoSaved ? '법인정보를 먼저 저장해주세요' : ''}
          >
            <FaSave className='mr-1' /> 연락처정보 저장
          </button>
        </div>
      </div>

      <div className='p-6 space-y-6'>
        {/* 기본정보 저장 안내 메시지 */}
        {!isBasicInfoSaved && (
          <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4'>
            <div className='flex items-center'>
              <div className='text-yellow-600 mr-3'>⚠️</div>
              <div className='text-sm text-yellow-800'>
                <strong>법인정보를 먼저 저장해주세요.</strong>
                <br />
                법인정보가 저장된 후에 담당자 정보를 입력할 수 있습니다.
              </div>
            </div>
          </div>
        )}

        {/* 담당자 목록 */}
        <div>
          <div className='flex justify-between items-center mb-4'>
            <h4 className='text-lg font-medium text-gray-800'>담당자 목록</h4>
            <button
              type='button'
              onClick={handleAddContact}
              disabled={!isBasicInfoSaved}
              className={`px-4 py-2 rounded-md flex items-center ${
                isBasicInfoSaved
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              title={
                !isBasicInfoSaved
                  ? '법인정보를 먼저 저장해주세요'
                  : '새 담당자 추가'
              }
            >
              <FaPlus className='mr-2' />새 담당자 추가
            </button>
          </div>

          {contacts.length > 0 ? (
            <div className='overflow-x-auto'>
              <table className='min-w-full border border-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      성명
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      부서
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      직급
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      연락처
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      상태
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      액션
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {contacts.map((contact, index) => {
                    const isSelected = selectedContactIndex === index;

                    return (
                      <tr
                        key={contact.id}
                        className={`cursor-pointer hover:bg-gray-50 ${
                          isSelected
                            ? 'bg-blue-50 border-l-4 border-blue-500'
                            : ''
                        }`}
                        onClick={() => handleSelectContact(index)}
                      >
                        <td className='px-4 py-4 whitespace-nowrap'>
                          <div className='text-sm font-medium text-gray-900'>
                            {contact.name || '새 담당자'}
                          </div>
                        </td>
                        <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {contact.department || '-'}
                        </td>
                        <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {contact.position || '-'}
                        </td>
                        <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
                          <div>{contact.mobile || contact.phone || '-'}</div>
                          {contact.email && (
                            <div className='text-xs text-gray-400'>
                              {contact.email}
                            </div>
                          )}
                        </td>
                        <td className='px-4 py-4 whitespace-nowrap'>
                          {getContactStatus(contact)}
                        </td>
                        <td className='px-4 py-4 whitespace-nowrap text-sm font-medium'>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteContact(index);
                            }}
                            className='text-red-600 hover:text-red-900 ml-2'
                            title='삭제'
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
            <div className='text-center py-8 text-gray-500'>
              {isBasicInfoSaved
                ? '등록된 담당자가 없습니다. 새 담당자를 추가해주세요.'
                : '법인정보를 저장한 후 담당자를 등록할 수 있습니다.'}
            </div>
          )}
        </div>

        {/* 상세 편집 영역 */}
        {editingContact && selectedContactIndex !== null && (
          <div className='border-t border-gray-200 pt-6'>
            <div className='mb-4 flex justify-between items-center'>
              <h4 className='text-lg font-medium text-gray-800'>
                📝 담당자 상세 정보 - {editingContact.name || '새 담당자'}
              </h4>
              <div>
                {!editingContact.isSaved && (
                  <span className='text-sm text-orange-600 bg-orange-50 px-2 py-1 rounded-full mt-2 inline-block'>
                    수정중
                  </span>
                )}
              </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              {/* 기본 정보 */}
              <div className='space-y-4'>
                <h5 className='font-medium text-gray-700 border-b pb-2'>
                  기본 정보
                </h5>

                {/* 담당자 성명 */}
                <div className='flex gap-2'>
                  <div className='flex-1'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      담당자 성명<span className='text-red-500 ml-1'>*</span>
                    </label>
                    <input
                      type='text'
                      value={editingContact.name}
                      onChange={(e) =>
                        handleEditingContactChange('name', e.target.value)
                      }
                      disabled={!isBasicInfoSaved}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                        !isBasicInfoSaved ? 'bg-gray-100 text-gray-500' : ''
                      }`}
                      placeholder='담당자 성명을 입력하세요'
                    />
                  </div>
                  <div className='flex items-end'>
                    <button
                      type='button'
                      onClick={() => setIsContactModalOpen(true)}
                      disabled={!isBasicInfoSaved}
                      className={`px-4 py-2 rounded-md flex items-center ${
                        isBasicInfoSaved
                          ? 'bg-blue-500 text-white hover:bg-blue-600'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      title={
                        !isBasicInfoSaved
                          ? '법인정보를 먼저 저장해주세요'
                          : '담당자 조회'
                      }
                    >
                      <FaSearch className='mr-1' />
                      조회
                    </button>
                  </div>
                </div>

                {/* 부서 */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    부서
                  </label>
                  <input
                    type='text'
                    value={editingContact.department}
                    onChange={(e) =>
                      handleEditingContactChange('department', e.target.value)
                    }
                    disabled={!isBasicInfoSaved}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      !isBasicInfoSaved ? 'bg-gray-100 text-gray-500' : ''
                    }`}
                    placeholder='부서를 입력하세요'
                  />
                </div>

                {/* 직급 */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    직급
                  </label>
                  <input
                    type='text'
                    value={editingContact.position}
                    onChange={(e) =>
                      handleEditingContactChange('position', e.target.value)
                    }
                    disabled={!isBasicInfoSaved}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      !isBasicInfoSaved ? 'bg-gray-100 text-gray-500' : ''
                    }`}
                    placeholder='직급을 입력하세요'
                  />
                </div>
              </div>

              {/* 연락처 정보 */}
              <div className='space-y-4'>
                <h5 className='font-medium text-gray-700 border-b pb-2'>
                  연락처 정보
                </h5>

                {/* 전화번호 */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    전화번호
                  </label>
                  <input
                    type='text'
                    value={editingContact.phone}
                    onChange={(e) =>
                      handleEditingContactChange('phone', e.target.value)
                    }
                    disabled={!isBasicInfoSaved}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      !isBasicInfoSaved ? 'bg-gray-100 text-gray-500' : ''
                    }`}
                    placeholder='000-0000-0000'
                  />
                </div>

                {/* 휴대폰번호 */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    휴대폰번호
                  </label>
                  <input
                    type='text'
                    value={editingContact.mobile}
                    onChange={(e) =>
                      handleEditingContactChange('mobile', e.target.value)
                    }
                    disabled={!isBasicInfoSaved}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      !isBasicInfoSaved ? 'bg-gray-100 text-gray-500' : ''
                    }`}
                    placeholder='000-0000-0000'
                  />
                </div>

                {/* 이메일 */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    이메일
                  </label>
                  <input
                    type='email'
                    value={editingContact.email}
                    onChange={(e) =>
                      handleEditingContactChange('email', e.target.value)
                    }
                    disabled={!isBasicInfoSaved}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      !isBasicInfoSaved ? 'bg-gray-100 text-gray-500' : ''
                    }`}
                    placeholder='example@company.com'
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 담당자 선택 모달 */}
      <ContactSelectionModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        onSelectContact={handleContactSearchSelect}
        corporationName={companyName}
      />
    </div>
  );
}
