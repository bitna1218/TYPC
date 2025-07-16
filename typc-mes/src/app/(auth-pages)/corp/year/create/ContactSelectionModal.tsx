import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { FaCheck } from 'react-icons/fa';
import { ContactFormData } from './ContactInfoSection';

type ContactSelectionModalProps = {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onClickSave: (data: ContactFormData) => void; // data will come from react-hook-form
  initialData?: ContactFormData | null;
};

export default function ContactSelectionModal({
  title,
  isOpen,
  onClose,
  onClickSave,
  initialData,
}: ContactSelectionModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    defaultValues: {
      name: '',
      department: '',
      position: '',
      phone: '',
      mobile: '',
      email: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset(initialData);
      } else {
        reset({
          name: '',
          department: '',
          position: '',
          phone: '',
          mobile: '',
          email: '',
        });
      }
    }
  }, [isOpen, initialData, reset]);

  if (!isOpen) return null;

  const onSubmit: SubmitHandler<ContactFormData> = (data) => {
    onClickSave(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="relative z-10 mx-4 max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl">
        {/* 담당자 등록 폼 */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="border-t bg-gray-50 px-6 py-4">
            <div className="mb-4">
              <h4 className="mb-2 text-lg font-semibold text-gray-800">
                {title}
              </h4>
            </div>

            <div className="space-y-4">
              {/* 법인 담당자 성명 */}
              <div className="flex items-center">
                <label className="w-32 text-sm font-medium text-gray-700">
                  법인 담당자 성명 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`flex-1 rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  {...register('name', {
                    required: '담당자 성명을 입력해주세요.',
                  })}
                  placeholder="담당자 성명을 입력하세요"
                />
              </div>
              {errors.name && (
                <div className="ml-32 mt-1 text-sm text-red-500">
                  {errors.name.message}
                </div>
              )}

              {/* 부서 */}
              <div className="flex items-center">
                <label className="w-32 text-sm font-medium text-gray-700">
                  부서 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  {...register('department', {
                    required: '부서를 입력해주세요.',
                  })}
                  placeholder="부서를 입력하세요"
                />
              </div>
              {errors.department && (
                <div className="ml-32 mt-1 text-sm text-red-500">
                  {errors.department.message}
                </div>
              )}

              {/* 직급 */}
              <div className="flex items-center">
                <label className="w-32 text-sm font-medium text-gray-700">
                  직급
                </label>
                <input
                  type="text"
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  {...register('position')}
                  placeholder="직급을 입력하세요"
                />
              </div>

              {/* 전화 번호 */}
              <div className="flex flex-col">
                <div className="flex items-center">
                  <label className="w-32 text-sm font-medium text-gray-700">
                    전화 번호
                  </label>
                  <input
                    type="text"
                    className={`flex-1 border px-3 py-2 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
                    {...register('phone')}
                    placeholder="02-2345-6789"
                  />
                </div>
                {errors.phone && (
                  <div className="ml-32 mt-1 text-sm text-red-500">
                    {errors.phone.message}
                  </div>
                )}
              </div>

              {/* 휴대폰 번호 */}
              <div className="flex flex-col">
                <div className="flex items-center">
                  <label className="w-32 text-sm font-medium text-gray-700">
                    휴대폰 번호
                  </label>
                  <input
                    type="text"
                    className={`flex-1 border px-3 py-2 ${
                      errors.mobile ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
                    {...register('mobile')}
                    placeholder="010-1234-5678"
                  />
                </div>
                {errors.mobile && (
                  <div className="ml-32 mt-1 text-sm text-red-500">
                    {errors.mobile.message}
                  </div>
                )}
              </div>

              {/* 이메일 */}
              <div className="flex flex-col">
                <div className="flex items-center">
                  <label className="w-32 text-sm font-medium text-gray-700">
                    이메일
                  </label>
                  <input
                    type="email"
                    className={`flex-1 border px-3 py-2 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
                    {...register('email', {
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                        message: '올바른 이메일 형식이 아닙니다.',
                      },
                    })}
                    placeholder="jung@greentech.com"
                  />
                </div>
                {errors.email && (
                  <div className="ml-32 mt-1 text-sm text-red-500">
                    {errors.email.message}
                  </div>
                )}
              </div>

              {/* 등록 버튼 */}
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button" // Prevent form submission
                  onClick={onClose}
                  className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex items-center rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
                >
                  <FaCheck className="mr-1" />
                  저장
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
