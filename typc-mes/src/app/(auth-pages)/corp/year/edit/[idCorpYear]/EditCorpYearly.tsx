'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { FaFileImport, FaArrowRight } from 'react-icons/fa';
import LoadDataModal from '@/components/LoadDataModal';
import SaveCorpYearlyInfo, {
  CorpYearlyInfoData,
} from '@/app/(auth-pages)/corp/year/create/SaveCorpYearlyInfo';
import ContactInfoSection from '@/app/(auth-pages)/corp/year/create/ContactInfoSection';
import { route } from '@/constants/route';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  CorpYearUpdateParams,
  getCorpYearDetailByIdAPI,
  updateCorpYearAPI,
  getCorpYearListAPI,
  CorpYearResult,
} from '@/http/endpoints/corpYear';
import { dummyUser } from '@/data/dummy';
import { emissionProcesses } from '@/constants/coprYear';
import { LocalStorage } from '@/utils/storage';
import debounce from 'lodash/debounce';
import { useForm, SubmitHandler } from 'react-hook-form';
import useToastMessage from '@/hooks/useToastMessage';
import { AxiosError } from 'axios';
import { useCommonCodesByGroup } from '@/hooks/useCommonCodes';
import { CODE_GROUP } from '@/constants/codeGroups';
import { CommonCode } from '@/http/endpoints/commonCode';

export default function EditCorpYearly() {
  const params = useParams();
  const idCorpYear = params.idCorpYear as string;
  const router = useRouter();
  const [selectedProgram] = useState<string>(
    LocalStorage.get('selectedProgram') || '',
  );
  const [currentDisplayYear] = useState<string | null>(
    LocalStorage.get('selectedYear') || null,
  );
  const { toast } = useToastMessage();
  const [showIndustryReference, setShowIndustryReference] = useState(false);
  const [isEmissionExpanded, setIsEmissionExpanded] = useState(false);
  const [isLoadDataModalOpen, setIsLoadDataModalOpen] = useState(false);

  // 저장 상태 관리
  const [isContactInfoSaved, setIsContactInfoSaved] = useState(false);
  const [selectedL1Name, setSelectedL1Name] = useState('');

  const { commonCodesResponse: ksicL1 } = useCommonCodesByGroup({
    group_code: CODE_GROUP.KSIC_L1,
    enabled: true,
  });

  const { commonCodesResponse: ksicL2 } = useCommonCodesByGroup({
    group_code: CODE_GROUP.KSIC_L2,
    enabled: true,
  });

  const { data: corpYearResultData, isLoading: isLoadingInitialData } =
    useQuery({
      queryKey: ['corpYearDetail', idCorpYear],
      queryFn: () => getCorpYearDetailByIdAPI(idCorpYear || ''),
      enabled: !!idCorpYear,
      select: (data) => data.result,
    });

  // Fetch all corp years for the "Load Data" modal
  const { data: corpYearListResponse } = useQuery({
    queryKey: ['getCorpYearListAllForEdit', dummyUser.id_corp],
    queryFn: () =>
      getCorpYearListAPI({
        id_corp: dummyUser.id_corp,
        from_year: 1990,
        to_year: new Date().getFullYear(),
      }),
    enabled: !!dummyUser.id_corp,
  });
  const allCorpYears = corpYearListResponse?.result?.content || [];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
    setValue,
    watch,
    reset,
  } = useForm<CorpYearlyInfoData>({
    defaultValues: {
      id_corp: dummyUser.id_corp,
      name_corp: '',
      name_ceo: '',
      no_corp: '',
      biz_type: '',
      biz_type_name: '',
      proc_ems_types: [],
      address: '',
      phone: '',
      post_code: '',
      desc: '',
    },
  });

  const watchedBizTypeName = watch('biz_type_name');
  const watchedProcEmsTypes = watch('proc_ems_types');

  // 검색어
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  // 계층적으로 그룹화된 산업분류 목록
  const groupedIndustries = useMemo(() => {
    if (!ksicL1 || !ksicL2) return [];

    const l2Map = new Map<string, CommonCode[]>();
    ksicL2.forEach((l2) => {
      if (l2.parent_code) {
        if (!l2Map.has(l2.parent_code)) {
          l2Map.set(l2.parent_code, []);
        }
        l2Map.get(l2.parent_code)!.push(l2);
      }
    });

    return ksicL1.map((l1) => ({
      ...l1,
      subItems: l2Map.get(l1.detail_code) || [],
    }));
  }, [ksicL1, ksicL2]);

  // 필터링된 산업분류 목록 (계층 구조 유지)
  const filteredIndustries = useMemo(() => {
    if (!debouncedSearchTerm) {
      return groupedIndustries;
    }

    const lowercasedTerm = debouncedSearchTerm.toLowerCase();
    const filtered: typeof groupedIndustries = [];

    groupedIndustries.forEach((l1) => {
      const filteredSubItems = l1.subItems.filter(
        (l2) =>
          l2.code_name.toLowerCase().includes(lowercasedTerm) ||
          l2.detail_code.toLowerCase().includes(lowercasedTerm),
      );

      if (
        l1.code_name.toLowerCase().includes(lowercasedTerm) ||
        filteredSubItems.length > 0
      ) {
        filtered.push({
          ...l1,
          subItems:
            l1.code_name.toLowerCase().includes(lowercasedTerm) &&
            filteredSubItems.length === 0
              ? l1.subItems
              : filteredSubItems,
        });
      }
    });

    return filtered;
  }, [groupedIndustries, debouncedSearchTerm]);

  useEffect(() => {
    if (!selectedProgram) {
      router.push('/');
    }

    if (!currentDisplayYear || !idCorpYear) {
      router.push(route.corp.year.path);
    }
  }, [router, currentDisplayYear, selectedProgram, idCorpYear]);

  // Debounce search term changes
  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms delay

    handler();

    // Cleanup function to cancel the debounce on unmount or when searchTerm changes
    return () => {
      handler.cancel();
    };
  }, [searchTerm]);

  // Effect to populate form and contacts with initially fetched data for idCorpYear
  useEffect(() => {
    if (corpYearResultData && ksicL2) {
      const { corp_year, proc_ems_types } = corpYearResultData;
      if (corp_year) {
        const industry = ksicL2.find(
          (ind) => ind.detail_code === corp_year.biz_type,
        );
        const parentL1 = groupedIndustries.find(
          (l1) => l1.detail_code === industry?.parent_code,
        );

        const initialFormData: CorpYearlyInfoData = {
          id_corp: corp_year.id_corp || dummyUser.id_corp,
          name_corp: corp_year.name_corp || '',
          name_ceo: corp_year.name_ceo || '',
          no_corp: corp_year.no_corp || '',
          biz_type: corp_year.biz_type || '',
          biz_type_name: industry
            ? `${industry.code_name} (${industry.detail_code})`
            : '',
          proc_ems_types: proc_ems_types || [],
          address: corp_year.address || '',
          phone: corp_year.phone || '',
          post_code: corp_year.post_code || '',
          desc: corp_year.desc || '',
        };
        reset(initialFormData);

        if (parentL1) {
          setSelectedL1Name(parentL1.code_name);
        }
      }
    }
  }, [corpYearResultData, ksicL2, groupedIndustries, reset]);

  const updateCorpYearMutation = useMutation({
    mutationFn: (data: CorpYearUpdateParams) => updateCorpYearAPI(data),
    onSuccess: (_, submittedData) => {
      toast.success('법인정보가 성공적으로 저장되었습니다.');
      // Reset the form with submitted data, making it pristine
      // Need to cast submittedData to CorpYearlyInfoData if types differ slightly
      const formData = { ...submittedData } as unknown as CorpYearlyInfoData;
      reset(formData);
    },
    onError: (error) => {
      toast.error(`법인정보 저장에 실패했습니다.`, error as AxiosError);
    },
  });

  // 법인정보 저장 (SubmitHandler for react-hook-form)
  const onFormSubmit: SubmitHandler<CorpYearlyInfoData> = (data) => {
    if (!currentDisplayYear) {
      toast.warn('연도가 선택되지 않았습니다.');
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { biz_type_name, ...rest } = data;

    const payload: CorpYearUpdateParams = {
      ...rest,
      corp_year_id: idCorpYear, // Always update the original idCorpYear
      updated_by: dummyUser.id,
    };

    updateCorpYearMutation.mutate(payload);
  };

  // 다음 단계로 이동
  const handleNext = () => {
    if (!isContactInfoSaved) {
      toast.warn('담당자를 먼저 저장해주세요.');
      return;
    }
    router.push(route.bizSite.corpYear.path(idCorpYear || ''));
  };

  // 공정배출 프로세스 토글 (for react-hook-form)
  const handleToggleEmissionProcess = (processValue: string) => {
    const currentProcesses = watch('proc_ems_types') || [];
    const newProcesses = currentProcesses.includes(processValue)
      ? currentProcesses.filter((p: string) => p !== processValue)
      : [...currentProcesses, processValue];
    setValue('proc_ems_types', newProcesses, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  // 산업 선택 핸들러 (for react-hook-form)
  const handleIndustrySelect = (ind: CommonCode) => {
    setValue('biz_type', ind.detail_code, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue('biz_type_name', `${ind.code_name} (${ind.detail_code})`, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setShowIndustryReference(false);

    const parentL1 = groupedIndustries.find(
      (l1) => l1.detail_code === ind.parent_code,
    );
    if (parentL1) {
      setSelectedL1Name(parentL1.code_name);
    } else {
      setSelectedL1Name('');
    }
  };

  const toggleEmissionExpanded = () => {
    setIsEmissionExpanded(!isEmissionExpanded);
  };

  // 선택된 프로세스 제거 (for react-hook-form)
  const handleRemoveEmissionProcess = (processValue: string) => {
    const currentProcesses = watch('proc_ems_types') || [];
    setValue(
      'proc_ems_types',
      currentProcesses.filter((p: string) => p !== processValue),
      { shouldValidate: true, shouldDirty: true },
    );
  };

  // Mutation for fetching details when loading data from modal
  const { mutate: fetchCorpYearDetailForModal } = useMutation<
    CorpYearResult,
    AxiosError,
    string
  >({
    mutationFn: (selectedCorpYearId: string) =>
      getCorpYearDetailByIdAPI(selectedCorpYearId).then((res) => res.result),
    onSuccess: (data) => {
      const { corp_year, proc_ems_types } = data;

      const industry = ksicL2?.find(
        (ind) => ind.detail_code === corp_year.biz_type,
      );
      const parentL1 = groupedIndustries.find(
        (l1) => l1.detail_code === industry?.parent_code,
      );

      const formDataToReset: CorpYearlyInfoData = {
        id_corp: dummyUser.id_corp,
        name_corp: corp_year.name_corp,
        name_ceo: corp_year.name_ceo,
        no_corp: corp_year.no_corp,
        biz_type: corp_year.biz_type || '',
        biz_type_name: industry
          ? `${industry.code_name} (${industry.detail_code})`
          : '',
        proc_ems_types: proc_ems_types || [],
        address: corp_year.address,
        phone: corp_year.phone,
        post_code: corp_year.post_code,
        desc: corp_year.desc || '',
      };
      reset(formDataToReset);

      if (parentL1) {
        setSelectedL1Name(parentL1.code_name);
      } else {
        setSelectedL1Name('');
      }

      toast.success(`${corp_year.year}년 데이터가 성공적으로 불러와졌습니다.`);
    },
    onError: (error) => {
      toast.error('데이터 불러오기에 실패했습니다.', error);
    },
  });

  const handleLoadDataFromModal = (selectedCorpYearId: string) => {
    fetchCorpYearDetailForModal(selectedCorpYearId);
  };

  if (isLoadingInitialData) {
    return (
      <>
        <div className="flex h-full items-center justify-center">
          <p>데이터를 불러오는 중입니다...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-800">법인</h2>
          <button
            type="button"
            onClick={() => setIsLoadDataModalOpen(true)}
            className={`flex items-center gap-2 rounded-md px-4 py-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
            title={'다른 연도 데이터 불러오기'}
          >
            <FaFileImport className={'text-blue-500'} />
            <span>불러오기</span>
          </button>
        </div>
        <div className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-600">
          * 표시는 필수 항목
        </div>
      </div>

      {/* 기본 정보 섹션 */}
      <SaveCorpYearlyInfo
        onSubmitForm={handleSubmit(onFormSubmit)}
        register={register}
        errors={errors}
        control={control}
        watchedBizTypeName={watchedBizTypeName}
        watchedProcEmsTypes={watchedProcEmsTypes}
        filteredIndustries={filteredIndustries}
        showIndustryReference={showIndustryReference}
        setShowIndustryReference={setShowIndustryReference}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onIndustrySelect={handleIndustrySelect}
        isEmissionExpanded={isEmissionExpanded}
        toggleEmissionExpanded={toggleEmissionExpanded}
        onToggleEmissionProcess={handleToggleEmissionProcess}
        onRemoveEmissionProcess={handleRemoveEmissionProcess}
        emissionProcesses={emissionProcesses}
        isSaved={!isDirty}
        l1CategoryName={selectedL1Name}
      />

      {/* 연락처 정보 섹션 */}
      <ContactInfoSection
        id_corp_year={idCorpYear}
        setIsContactInfoSaved={setIsContactInfoSaved}
      />

      {/* 데이터 불러오기 모달 */}
      <LoadDataModal
        isOpen={isLoadDataModalOpen}
        onClose={() => setIsLoadDataModalOpen(false)}
        onLoadData={handleLoadDataFromModal}
        currentYear={currentDisplayYear || undefined}
        yearsData={allCorpYears}
      />

      {/* 버튼 영역 */}
      <div className="mt-8 flex justify-end space-x-4">
        <button
          type="button"
          className="rounded-md border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={() => router.push(route.corp.year.path)}
        >
          취소
        </button>
        <button
          type="button"
          className={`flex items-center rounded-md px-6 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isContactInfoSaved
              ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
              : 'cursor-not-allowed bg-gray-300 text-gray-500'
          }`}
          onClick={handleNext}
          disabled={!isContactInfoSaved}
        >
          <span>다음</span>
          <FaArrowRight className="ml-2" />
        </button>
      </div>
    </>
  );
}
