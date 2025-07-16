import { useState } from 'react';
import { FaTimes, FaPlus, FaCheck } from 'react-icons/fa';

// 담당자 인터페이스
interface Contact {
  id: string;
  name: string;
  department: string;
  position: string;
  phone: string;
  mobile: string;
  email: string;
}

interface ContactSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectContact: (contact: Contact) => void;
  corporationName: string;
}

// 유효성 검사 인터페이스
interface ValidationErrors {
  phone: string;
  mobile: string;
  email: string;
}

export default function ContactSelectionModal({
  isOpen,
  onClose,
  onSelectContact,
  corporationName,
}: ContactSelectionModalProps) {
  const [selectedContactId, setSelectedContactId] = useState<string | null>(
    null
  );
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  // 새 담당자 등록 폼 상태
  const [newContact, setNewContact] = useState({
    name: '',
    department: '',
    position: '',
    phone: '',
    mobile: '',
    email: '',
  });

  // 유효성 검사 오류 상태
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
    phone: '',
    mobile: '',
    email: '',
  });

  // 기존 담당자 목록 (실제 구현에서는 API에서 가져옴)
  const [existingContacts, setExistingContacts] = useState<Contact[]>([
    {
      id: '1',
      name: '홍길동',
      department: '환경안전팀',
      position: '과장',
      phone: '02-2345-6789',
      mobile: '010-1234-5678',
      email: 'hong@company.com',
    },
    {
      id: '2',
      name: '김철수',
      department: '환경안전팀',
      position: '대리',
      phone: '02-2345-6788',
      mobile: '010-1234-5679',
      email: 'kim@company.com',
    },
  ]);

  if (!isOpen) return null;

  // 전화번호 유효성 검사
  const validatePhone = (value: string): boolean => {
    // 비어있으면 유효성 검사 통과 (필수 입력 아님)
    if (!value) return true;
    
    // 전화번호 형식: 02-XXXX-XXXX 또는 0XX-XXX-XXXX
    const phoneRegex = /^(02|0\d{1,2})-\d{3,4}-\d{4}$/;
    return phoneRegex.test(value);
  };

  // 휴대폰 번호 유효성 검사
  const validateMobile = (value: string): boolean => {
    // 비어있으면 유효성 검사 통과 (필수 입력 아님)
    if (!value) return true;
    
    // 휴대폰 번호 형식: 010-XXXX-XXXX
    const mobileRegex = /^010-\d{4}-\d{4}$/;
    return mobileRegex.test(value);
  };

  // 이메일 유효성 검사
  const validateEmail = (value: string): boolean => {
    // 비어있으면 유효성 검사 통과 (필수 입력 아님)
    if (!value) return true;
    
    // 이메일 형식 검사
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(value);
  };

  // 입력값 변경 핸들러 (유효성 검사 포함)
  const handleInputChange = (field: string, value: string) => {
    // 상태 업데이트
    setNewContact((prev) => ({
      ...prev,
      [field]: value,
    }));

    // 유효성 검사 진행
    if (field === 'phone') {
      setValidationErrors((prev) => ({
        ...prev,
        phone: validatePhone(value) ? '' : '올바른 전화번호 형식이 아닙니다. (예: 02-1234-5678)',
      }));
    } else if (field === 'mobile') {
      setValidationErrors((prev) => ({
        ...prev,
        mobile: validateMobile(value) ? '' : '올바른 휴대폰 번호 형식이 아닙니다. (예: 010-1234-5678)',
      }));
    } else if (field === 'email') {
      setValidationErrors((prev) => ({
        ...prev,
        email: validateEmail(value) ? '' : '올바른 이메일 형식이 아닙니다.',
      }));
    }
  };

  const handleContactSelect = () => {
    const selectedContact = existingContacts.find(
      (contact) => contact.id === selectedContactId
    );
    if (selectedContact) {
      onSelectContact(selectedContact);
      onClose();
    }
  };

  const handleRegisterNewContact = () => {
    // 필수 항목 검증
    if (!newContact.name.trim()) {
      alert('담당자 성명을 입력해주세요.');
      return;
    }

    // 전화번호, 휴대폰, 이메일 유효성 검사
    const isPhoneValid = validatePhone(newContact.phone);
    const isMobileValid = validateMobile(newContact.mobile);
    const isEmailValid = validateEmail(newContact.email);

    // 유효성 검사 오류 업데이트
    setValidationErrors({
      phone: isPhoneValid ? '' : '올바른 전화번호 형식이 아닙니다. (예: 02-1234-5678)',
      mobile: isMobileValid ? '' : '올바른 휴대폰 번호 형식이 아닙니다. (예: 010-1234-5678)',
      email: isEmailValid ? '' : '올바른 이메일 형식이 아닙니다.',
    });

    // 유효성 검사 실패 시 저장하지 않음
    if (!isPhoneValid || !isMobileValid || !isEmailValid) {
      return;
    }

    // 새 담당자 추가
    const newContactData: Contact = {
      id: Date.now().toString(),
      ...newContact,
    };

    setExistingContacts((prev) => [...prev, newContactData]);

    // 새로 등록한 담당자 선택
    onSelectContact(newContactData);

    // 폼 초기화 및 모달 닫기
    setNewContact({
      name: '',
      department: '',
      position: '',
      phone: '',
      mobile: '',
      email: '',
    });
    setValidationErrors({
      phone: '',
      mobile: '',
      email: '',
    });
    setShowRegistrationForm(false);
    onClose();
  };

  const resetRegistrationForm = () => {
    setNewContact({
      name: '',
      department: '',
      position: '',
      phone: '',
      mobile: '',
      email: '',
    });
    setValidationErrors({
      phone: '',
      mobile: '',
      email: '',
    });
    setShowRegistrationForm(false);
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div
        className='fixed inset-0 bg-black opacity-50'
        onClick={onClose}
      ></div>

      <div className='relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 z-10 max-h-[90vh] overflow-hidden'>
        {/* 헤더 */}
        <div className='flex justify-between items-center border-b border-gray-200 px-6 py-4'>
          <div>
            <h3 className='text-lg font-semibold text-gray-800'>
              담당자 선택
            </h3>
            <p className='text-sm text-gray-500 mt-1'>
              사업장의 담당자 목록을 불러옵니다
            </p>
          </div>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-500 focus:outline-none'
          >
            <FaTimes className='h-5 w-5' />
          </button>
        </div>

        <div
          className='overflow-y-auto'
          style={{ maxHeight: 'calc(90vh - 120px)' }}
        >
          {/* 사업장명 표시 */}
          <div className='px-6 py-3 bg-gray-50 border-b'>
            <p className='text-sm'>
              <span className='font-medium'>사업장:</span> {corporationName}
            </p>
          </div>

          {/* 담당자 등록 버튼 */}
          <div className='px-6 py-4 border-b'>
            <button
              onClick={() => setShowRegistrationForm(!showRegistrationForm)}
              className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none flex items-center'
            >
              <FaPlus className='mr-2' />
              담당자 등록
            </button>
          </div>

          {/* 기존 담당자 목록 */}
          <div className='px-6 py-4 overflow-hidden'>
            {/* 테이블 전체 컨테이너 */}
            <div className='overflow-x-auto max-w-full'>
              <table className='min-w-[900px] w-full border-collapse'>
                {/* 테이블 헤더 */}
                <thead className='bg-blue-500 text-white rounded-t-md'>
                  <tr className='text-sm font-medium'>
                    <th className='py-3 px-2 text-center w-[5%]'>□</th>
                    <th className='py-3 px-2 text-center w-[10%]'>사업장 담당자 성명</th>
                    <th className='py-3 px-2 text-center w-[10%]'>부서</th>
                    <th className='py-3 px-2 text-center w-[10%]'>직급</th>
                    <th className='py-3 px-2 text-center w-[12%]'>전화 번호</th>
                    <th className='py-3 px-2 text-center w-[12%]'>휴대폰 번호</th>
                    <th className='py-3 px-2 text-center w-[30%]'>이메일</th>
                    <th className='py-3 px-2 text-center w-[11%]'>UD</th>
                  </tr>
                </thead>

                {/* 테이블 내용 */}
                <tbody className='border border-gray-300 rounded-b-md'>
                  {existingContacts.map((contact) => (
                    <tr
                      key={contact.id}
                      className={`text-sm border-b border-gray-200 last:border-b-0 hover:bg-gray-50 ${
                        selectedContactId === contact.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <td className='py-3 px-2 text-center'>
                        <div className='flex justify-center items-center'>
                          <input
                            type='checkbox'
                            checked={selectedContactId === contact.id}
                            onChange={() =>
                              setSelectedContactId(
                                selectedContactId === contact.id ? null : contact.id
                              )
                            }
                            className='form-checkbox h-4 w-4 text-blue-600'
                          />
                        </div>
                      </td>
                      <td className='py-3 px-2 text-center'>{contact.name}</td>
                      <td className='py-3 px-2 text-center'>{contact.department}</td>
                      <td className='py-3 px-2 text-center'>{contact.position}</td>
                      <td className='py-3 px-2 text-center'>{contact.phone}</td>
                      <td className='py-3 px-2 text-center'>{contact.mobile}</td>
                      <td className='py-3 px-2 text-center text-blue-600'>{contact.email}</td>
                      <td className='py-3 px-2 text-center'>
                        <button className='text-blue-600 hover:text-blue-800'>
                          수정 삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 선택완료 버튼 */}
            <div className='mt-4 flex justify-end'>
              <button
                onClick={handleContactSelect}
                disabled={!selectedContactId}
                className={`px-6 py-2 rounded-md focus:outline-none ${
                  selectedContactId
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                선택완료
              </button>
            </div>
          </div>

          {/* 담당자 등록 폼 */}
          {showRegistrationForm && (
            <div className='px-6 py-4 bg-gray-50 border-t'>
              <div className='mb-4'>
                <h4 className='text-lg font-semibold text-gray-800 mb-2'>
                  담당자 등록
                </h4>
                <p className='text-sm text-gray-600'>담당자를 등록 합니다</p>
              </div>

              <div className='space-y-4'>
                {/* 담당자 성명 */}
                <div className='flex items-center'>
                  <label className='w-32 text-sm font-medium text-gray-700'>
                    담당자 성명 <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    className='flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                    value={newContact.name}
                    onChange={(e) =>
                      setNewContact({ ...newContact, name: e.target.value })
                    }
                    placeholder='담당자 성명을 입력하세요'
                  />
                </div>

                {/* 부서 */}
                <div className='flex items-center'>
                  <label className='w-32 text-sm font-medium text-gray-700'>
                    부서
                  </label>
                  <input
                    type='text'
                    className='flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                    value={newContact.department}
                    onChange={(e) =>
                      setNewContact({
                        ...newContact,
                        department: e.target.value,
                      })
                    }
                    placeholder='부서를 입력하세요'
                  />
                </div>

                {/* 직급 */}
                <div className='flex items-center'>
                  <label className='w-32 text-sm font-medium text-gray-700'>
                    직급
                  </label>
                  <input
                    type='text'
                    className='flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                    value={newContact.position}
                    onChange={(e) =>
                      setNewContact({ ...newContact, position: e.target.value })
                    }
                    placeholder='직급을 입력하세요'
                  />
                </div>

                {/* 전화 번호 */}
                <div className='flex flex-col'>
                  <div className='flex items-center'>
                    <label className='w-32 text-sm font-medium text-gray-700'>
                      전화 번호
                    </label>
                    <input
                      type='text'
                      className={`flex-1 px-3 py-2 border ${
                        validationErrors.phone ? 'border-red-500' : 'border-gray-300'
                      } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      value={newContact.phone}
                      onChange={(e) =>
                        handleInputChange('phone', e.target.value)
                      }
                      placeholder='02-2345-6789'
                    />
                  </div>
                  {validationErrors.phone && (
                    <div className='ml-32 mt-1 text-sm text-red-500'>
                      {validationErrors.phone}
                    </div>
                  )}
                </div>

                {/* 휴대폰 번호 */}
                <div className='flex flex-col'>
                  <div className='flex items-center'>
                    <label className='w-32 text-sm font-medium text-gray-700'>
                      휴대폰 번호
                    </label>
                    <input
                      type='text'
                      className={`flex-1 px-3 py-2 border ${
                        validationErrors.mobile ? 'border-red-500' : 'border-gray-300'
                      } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      value={newContact.mobile}
                      onChange={(e) =>
                        handleInputChange('mobile', e.target.value)
                      }
                      placeholder='010-1234-5678'
                    />
                  </div>
                  {validationErrors.mobile && (
                    <div className='ml-32 mt-1 text-sm text-red-500'>
                      {validationErrors.mobile}
                    </div>
                  )}
                </div>

                {/* 이메일 */}
                <div className='flex flex-col'>
                  <div className='flex items-center'>
                    <label className='w-32 text-sm font-medium text-gray-700'>
                      이메일
                    </label>
                    <input
                      type='email'
                      className={`flex-1 px-3 py-2 border ${
                        validationErrors.email ? 'border-red-500' : 'border-gray-300'
                      } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      value={newContact.email}
                      onChange={(e) =>
                        handleInputChange('email', e.target.value)
                      }
                      placeholder='hong@company.com'
                    />
                  </div>
                  {validationErrors.email && (
                    <div className='ml-32 mt-1 text-sm text-red-500'>
                      {validationErrors.email}
                    </div>
                  )}
                </div>

                {/* 등록 버튼 */}
                <div className='flex justify-end space-x-2 pt-4'>
                  <button
                    onClick={resetRegistrationForm}
                    className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50'
                  >
                    취소
                  </button>
                  <button
                    onClick={handleRegisterNewContact}
                    className='px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center'
                  >
                    <FaCheck className='mr-1' />
                    저장
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 