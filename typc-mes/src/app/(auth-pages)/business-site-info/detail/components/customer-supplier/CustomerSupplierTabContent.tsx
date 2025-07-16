'use client';

import React, { useState, useEffect } from 'react';
import TransportationModal from './TransportationModal';
import CompanyItemDetail from './CompanyItemDetail';
import {
  FaPlus,
  FaChevronRight,
  FaTrash,
  FaUpload,
  FaChevronDown,
  FaChevronUp,
  FaSave,
} from 'react-icons/fa';
import { FaCircleInfo } from 'react-icons/fa6';

// 일반 업체 인터페이스 (고객사, 공급업체, 폐기물 처리업체용)
export interface CompanyItem {
  id: number;
  name: string;
  originCountry: string;
  destinationCountry: string;
  transportation: string;
  distance: string;
  file: File | null;
}

// 외주업체 인터페이스 (다른 항목 구성)
export interface OutsourcingCompany {
  id: number;
  name: string; // 외주업체명
  address: string; // 사업장 주소
  contactName: string; // 담당자 성명
  contactPhone: string; // 담당자 연락처
  contactEmail: string; // 담당자 이메일
  file: File | null; // 파일 첨부
}

// 섹션 헤더 컴포넌트
interface SectionHeaderProps {
  title: string;
  isCollapsed: boolean;
  isUsed: boolean;
  onToggleCollapse: () => void;
  onToggleUse: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  isCollapsed,
  isUsed,
  onToggleCollapse,
  onToggleUse,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
      <div className="flex items-center space-x-2">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <button
          type="button"
          className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? '펼치기' : '접기'}
        >
          {isCollapsed ? <FaChevronDown /> : <FaChevronUp />}
        </button>

        {/* 모바일에서 체크박스 대신 표시할 토글 버튼 */}
        <div className="relative md:hidden">
          <button
            type="button"
            className={`ml-2 rounded-full p-1.5 focus:outline-none ${isUsed ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'}`}
            onClick={() => setShowTooltip(!showTooltip)}
            aria-label="카테고리 사용 설정"
          >
            <FaCircleInfo />
          </button>

          {showTooltip && (
            <div className="absolute right-0 top-8 z-10 w-48 rounded-md border border-gray-200 bg-white p-3 shadow-lg">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`use-mobile-${title.replace(/[^a-zA-Z0-9]/g, '')}`}
                  checked={isUsed}
                  onChange={onToggleUse}
                  className="mr-2 h-4 w-4"
                />
                <label
                  htmlFor={`use-mobile-${title.replace(/[^a-zA-Z0-9]/g, '')}`}
                  className="text-sm text-gray-600"
                >
                  이 카테고리 사용
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 데스크톱 체크박스 - 모바일에서는 숨김 */}
      <div className="ml-2 mt-2 hidden items-center md:mt-0 md:flex">
        <input
          type="checkbox"
          id={`use-${title.replace(/[^a-zA-Z0-9]/g, '')}`}
          checked={isUsed}
          onChange={onToggleUse}
          className="mr-2 h-4 w-4"
        />
        <label
          htmlFor={`use-${title.replace(/[^a-zA-Z0-9]/g, '')}`}
          className="text-sm text-gray-600"
        >
          이 카테고리 사용
        </label>
      </div>
    </div>
  );
};

export interface CustomerSupplierData {
  customers: CompanyItem[];
  suppliers: CompanyItem[];
  wasteProcessors: CompanyItem[];
  outsourcingCompanies: OutsourcingCompany[];
  useCustomers: boolean;
  useSuppliers: boolean;
  useWasteProcessors: boolean;
  useOutsourcing: boolean;
}

interface CustomerSupplierTabContentProps {
  selectedProgram?: string;
  siteId?: string;
  onTabChange?: (tabId: string) => void;
}

export default function CustomerSupplierTabContent({
  selectedProgram,
  siteId,
  onTabChange,
}: CustomerSupplierTabContentProps) {
  // 고객사, 공급업체, 폐기물 처리업체 상태 관리 (기존 코드 유지)
  const [customers, setCustomers] = useState<CompanyItem[]>([
    {
      id: 1,
      name: '',
      originCountry: '',
      destinationCountry: '',
      transportation: '',
      distance: '',
      file: null,
    },
  ]);

  const [suppliers, setSuppliers] = useState<CompanyItem[]>([
    {
      id: 1,
      name: '',
      originCountry: '',
      destinationCountry: '',
      transportation: '',
      distance: '',
      file: null,
    },
  ]);

  const [wasteProcessors, setWasteProcessors] = useState<CompanyItem[]>([
    {
      id: 1,
      name: '',
      originCountry: '',
      destinationCountry: '',
      transportation: '',
      distance: '',
      file: null,
    },
  ]);

  // 외주업체 상태 관리
  const [outsourcingCompanies, setOutsourcingCompanies] = useState<
    OutsourcingCompany[]
  >([
    {
      id: 1,
      name: '',
      address: '',
      contactName: '',
      contactPhone: '',
      contactEmail: '',
      file: null,
    },
  ]);

  // 섹션 사용 여부 상태
  const [useCustomers, setUseCustomers] = useState(true);
  const [useSuppliers, setUseSuppliers] = useState(true);
  const [useWasteProcessors, setUseWasteProcessors] = useState(true);
  const [useOutsourcing, setUseOutsourcing] = useState(true);

  // 섹션 접기/펼치기 상태
  const [customersCollapsed, setCustomersCollapsed] = useState(false);
  const [suppliersCollapsed, setSuppliersCollapsed] = useState(false);
  const [wasteProcessorsCollapsed, setWasteProcessorsCollapsed] =
    useState(false);
  const [outsourcingCollapsed, setOutsourcingCollapsed] = useState(false);

  // 선택된 항목 ID
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
    null,
  );
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(
    null,
  );
  const [selectedWasteProcessorId, setSelectedWasteProcessorId] = useState<
    number | null
  >(null);
  const [selectedOutsourcingId, setSelectedOutsourcingId] = useState<
    number | null
  >(null);

  // 모달 관련 상태
  const [showTransportationModal, setShowTransportationModal] =
    useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<
    'customer' | 'supplier' | 'wasteProcessor'
  >('customer');

  // State for tracking saved status for each component
  const [customersSaved, setCustomersSaved] = useState<boolean>(false);
  const [suppliersSaved, setSuppliersSaved] = useState<boolean>(false);
  const [wasteProcessorsSaved, setWasteProcessorsSaved] =
    useState<boolean>(false);
  const [outsourcingSaved, setOutsourcingSaved] = useState<boolean>(false);

  // Check if all required sections are saved
  const [allRequiredSaved, setAllRequiredSaved] = useState<boolean>(false);

  // 컴포넌트 마운트 시 기존 데이터 로드 및 첫 번째 항목 선택
  useEffect(() => {
    if (siteId) {
      console.log(`사이트 ID ${siteId}에 대한 데이터를 로드합니다.`);
    }

    if (customers.length > 0) {
      setSelectedCustomerId(customers[0].id);
    }

    if (suppliers.length > 0) {
      setSelectedSupplierId(suppliers[0].id);
    }

    if (wasteProcessors.length > 0) {
      setSelectedWasteProcessorId(wasteProcessors[0].id);
    }

    if (outsourcingCompanies.length > 0) {
      setSelectedOutsourcingId(outsourcingCompanies[0].id);
    }
  }, [
    siteId,
    selectedProgram,
    customers,
    suppliers,
    wasteProcessors,
    outsourcingCompanies,
  ]);

  // 기존 고객사, 공급업체, 폐기물 처리업체 관련 핸들러 함수 (코드 유지)
  const handleAddCustomer = () => {
    const newId =
      customers.length > 0 ? Math.max(...customers.map((c) => c.id)) + 1 : 1;
    const newCustomer = {
      id: newId,
      name: '',
      originCountry: '',
      destinationCountry: '',
      transportation: '',
      distance: '',
      file: null,
    };

    setCustomers([...customers, newCustomer]);
    setSelectedCustomerId(newId);
  };

  const handleDeleteCustomer = (id: number) => {
    if (customers.length <= 1) {
      alert('최소 1개 이상의 고객사 정보가 필요합니다.');
      return;
    }

    if (!confirm('선택한 고객사를 삭제하시겠습니까?')) {
      return;
    }

    const filteredCustomers = customers.filter(
      (customer) => customer.id !== id,
    );
    setCustomers(filteredCustomers);

    if (id === selectedCustomerId) {
      setSelectedCustomerId(
        filteredCustomers.length > 0 ? filteredCustomers[0].id : null,
      );
    }
  };

  const handleCustomerInputChange = (
    field: keyof CompanyItem,
    value: string,
  ) => {
    if (!selectedCustomerId) return;

    setCustomers(
      customers.map((customer) =>
        customer.id === selectedCustomerId
          ? { ...customer, [field]: value }
          : customer,
      ),
    );
  };

  const handleCustomerTransportationClick = () => {
    if (!selectedCustomerId) return;
    setActiveSection('customer');
    setShowTransportationModal(true);
  };

  const handleCustomerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedCustomerId) return;

    if (e.target.files && e.target.files.length > 0) {
      setCustomers(
        customers.map((customer) =>
          customer.id === selectedCustomerId
            ? { ...customer, file: e.target.files![0] }
            : customer,
        ),
      );
    }
  };

  const handleCustomerFileDelete = () => {
    if (!selectedCustomerId) return;

    setCustomers(
      customers.map((customer) =>
        customer.id === selectedCustomerId
          ? { ...customer, file: null }
          : customer,
      ),
    );
  };

  // 공급업체 관련 핸들러 함수
  const handleAddSupplier = () => {
    const newId =
      suppliers.length > 0 ? Math.max(...suppliers.map((s) => s.id)) + 1 : 1;
    const newSupplier = {
      id: newId,
      name: '',
      originCountry: '',
      destinationCountry: '',
      transportation: '',
      distance: '',
      file: null,
    };

    setSuppliers([...suppliers, newSupplier]);
    setSelectedSupplierId(newId);
  };

  const handleDeleteSupplier = (id: number) => {
    if (suppliers.length <= 1) {
      alert('최소 1개 이상의 공급업체 정보가 필요합니다.');
      return;
    }

    if (!confirm('선택한 공급업체를 삭제하시겠습니까?')) {
      return;
    }

    const filteredSuppliers = suppliers.filter(
      (supplier) => supplier.id !== id,
    );
    setSuppliers(filteredSuppliers);

    if (id === selectedSupplierId) {
      setSelectedSupplierId(
        filteredSuppliers.length > 0 ? filteredSuppliers[0].id : null,
      );
    }
  };

  const handleSupplierInputChange = (
    field: keyof CompanyItem,
    value: string,
  ) => {
    if (!selectedSupplierId) return;

    setSuppliers(
      suppliers.map((supplier) =>
        supplier.id === selectedSupplierId
          ? { ...supplier, [field]: value }
          : supplier,
      ),
    );
  };

  const handleSupplierTransportationClick = () => {
    if (!selectedSupplierId) return;
    setActiveSection('supplier');
    setShowTransportationModal(true);
  };

  const handleSupplierFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedSupplierId) return;

    if (e.target.files && e.target.files.length > 0) {
      setSuppliers(
        suppliers.map((supplier) =>
          supplier.id === selectedSupplierId
            ? { ...supplier, file: e.target.files![0] }
            : supplier,
        ),
      );
    }
  };

  const handleSupplierFileDelete = () => {
    if (!selectedSupplierId) return;

    setSuppliers(
      suppliers.map((supplier) =>
        supplier.id === selectedSupplierId
          ? { ...supplier, file: null }
          : supplier,
      ),
    );
  };

  // 폐기물 처리업체 관련 핸들러 함수
  const handleAddWasteProcessor = () => {
    const newId =
      wasteProcessors.length > 0
        ? Math.max(...wasteProcessors.map((w) => w.id)) + 1
        : 1;
    const newWasteProcessor = {
      id: newId,
      name: '',
      originCountry: '',
      destinationCountry: '',
      transportation: '',
      distance: '',
      file: null,
    };

    setWasteProcessors([...wasteProcessors, newWasteProcessor]);
    setSelectedWasteProcessorId(newId);
  };

  const handleDeleteWasteProcessor = (id: number) => {
    if (wasteProcessors.length <= 1) {
      alert('최소 1개 이상의 폐기물 처리업체 정보가 필요합니다.');
      return;
    }

    if (!confirm('선택한 폐기물 처리업체를 삭제하시겠습니까?')) {
      return;
    }

    const filteredWasteProcessors = wasteProcessors.filter(
      (wasteProcessor) => wasteProcessor.id !== id,
    );
    setWasteProcessors(filteredWasteProcessors);

    if (id === selectedWasteProcessorId) {
      setSelectedWasteProcessorId(
        filteredWasteProcessors.length > 0
          ? filteredWasteProcessors[0].id
          : null,
      );
    }
  };

  const handleWasteProcessorInputChange = (
    field: keyof CompanyItem,
    value: string,
  ) => {
    if (!selectedWasteProcessorId) return;

    setWasteProcessors(
      wasteProcessors.map((wasteProcessor) =>
        wasteProcessor.id === selectedWasteProcessorId
          ? { ...wasteProcessor, [field]: value }
          : wasteProcessor,
      ),
    );
  };

  const handleWasteProcessorTransportationClick = () => {
    if (!selectedWasteProcessorId) return;
    setActiveSection('wasteProcessor');
    setShowTransportationModal(true);
  };

  const handleWasteProcessorFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!selectedWasteProcessorId) return;

    if (e.target.files && e.target.files.length > 0) {
      setWasteProcessors(
        wasteProcessors.map((wasteProcessor) =>
          wasteProcessor.id === selectedWasteProcessorId
            ? { ...wasteProcessor, file: e.target.files![0] }
            : wasteProcessor,
        ),
      );
    }
  };

  const handleWasteProcessorFileDelete = () => {
    if (!selectedWasteProcessorId) return;

    setWasteProcessors(
      wasteProcessors.map((wasteProcessor) =>
        wasteProcessor.id === selectedWasteProcessorId
          ? { ...wasteProcessor, file: null }
          : wasteProcessor,
      ),
    );
  };

  // 외주업체 관련 핸들러 함수
  const handleAddOutsourcing = () => {
    const newId =
      outsourcingCompanies.length > 0
        ? Math.max(...outsourcingCompanies.map((o) => o.id)) + 1
        : 1;
    const newOutsourcing = {
      id: newId,
      name: '',
      address: '',
      contactName: '',
      contactPhone: '',
      contactEmail: '',
      file: null,
    };

    setOutsourcingCompanies([...outsourcingCompanies, newOutsourcing]);
    setSelectedOutsourcingId(newId);
  };

  const handleDeleteOutsourcing = (id: number) => {
    if (outsourcingCompanies.length <= 1) {
      alert('최소 1개 이상의 외주업체 정보가 필요합니다.');
      return;
    }

    if (!confirm('선택한 외주업체를 삭제하시겠습니까?')) {
      return;
    }

    const filteredOutsourcing = outsourcingCompanies.filter(
      (company) => company.id !== id,
    );
    setOutsourcingCompanies(filteredOutsourcing);

    if (id === selectedOutsourcingId) {
      setSelectedOutsourcingId(
        filteredOutsourcing.length > 0 ? filteredOutsourcing[0].id : null,
      );
    }
  };

  const handleOutsourcingInputChange = (
    field: keyof OutsourcingCompany,
    value: string,
  ) => {
    if (!selectedOutsourcingId) return;

    setOutsourcingCompanies(
      outsourcingCompanies.map((company) =>
        company.id === selectedOutsourcingId
          ? { ...company, [field]: value }
          : company,
      ),
    );
  };

  const handleOutsourcingFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!selectedOutsourcingId) return;

    if (e.target.files && e.target.files.length > 0) {
      setOutsourcingCompanies(
        outsourcingCompanies.map((company) =>
          company.id === selectedOutsourcingId
            ? { ...company, file: e.target.files![0] }
            : company,
        ),
      );
    }
  };

  const handleOutsourcingFileDelete = () => {
    if (!selectedOutsourcingId) return;

    setOutsourcingCompanies(
      outsourcingCompanies.map((company) =>
        company.id === selectedOutsourcingId
          ? { ...company, file: null }
          : company,
      ),
    );
  };

  // 섹션 접기/펼치기 토글 핸들러
  const toggleCustomersCollapse = () => {
    setCustomersCollapsed(!customersCollapsed);
  };

  const toggleSuppliersCollapse = () => {
    setSuppliersCollapsed(!suppliersCollapsed);
  };

  const toggleWasteProcessorsCollapse = () => {
    setWasteProcessorsCollapsed(!wasteProcessorsCollapsed);
  };

  const toggleOutsourcingCollapse = () => {
    setOutsourcingCollapsed(!outsourcingCollapsed);
  };

  // 카테고리 사용 여부 토글 핸들러
  const toggleUseCustomers = () => {
    setUseCustomers(!useCustomers);
    if (!useCustomers) {
      setCustomersCollapsed(false); // 카테고리 사용 시 자동으로 펼치기
    } else {
      setCustomersCollapsed(true); // 카테고리 미사용 시 자동으로 접기
    }
  };

  const toggleUseSuppliers = () => {
    setUseSuppliers(!useSuppliers);
    if (!useSuppliers) {
      setSuppliersCollapsed(false); // 카테고리 사용 시 자동으로 펼치기
    } else {
      setSuppliersCollapsed(true); // 카테고리 미사용 시 자동으로 접기
    }
  };

  const toggleUseWasteProcessors = () => {
    setUseWasteProcessors(!useWasteProcessors);
    if (!useWasteProcessors) {
      setWasteProcessorsCollapsed(false); // 카테고리 사용 시 자동으로 펼치기
    } else {
      setWasteProcessorsCollapsed(true); // 카테고리 미사용 시 자동으로 접기
    }
  };

  const toggleUseOutsourcing = () => {
    setUseOutsourcing(!useOutsourcing);
    if (!useOutsourcing) {
      setOutsourcingCollapsed(false); // 카테고리 사용 시 자동으로 펼치기
    } else {
      setOutsourcingCollapsed(true); // 카테고리 미사용 시 자동으로 접기
    }
  };

  // 운송수단 선택 핸들러
  const handleTransportationSelect = (transportation: string) => {
    if (activeSection === 'customer') {
      if (!selectedCustomerId) return;
      handleCustomerInputChange('transportation', transportation);
    } else if (activeSection === 'supplier') {
      if (!selectedSupplierId) return;
      handleSupplierInputChange('transportation', transportation);
    } else if (activeSection === 'wasteProcessor') {
      if (!selectedWasteProcessorId) return;
      handleWasteProcessorInputChange('transportation', transportation);
    }
  };

  // Update allRequiredSaved when any saved state or category usage changes
  useEffect(() => {
    // Check if all active categories are saved
    const activeCategories = [
      { isUsed: useCustomers, isSaved: customersSaved },
      { isUsed: useSuppliers, isSaved: suppliersSaved },
      { isUsed: useWasteProcessors, isSaved: wasteProcessorsSaved },
      { isUsed: useOutsourcing, isSaved: outsourcingSaved },
    ];

    // All active categories must be saved
    const allActive = activeCategories.filter((cat) => cat.isUsed);
    const allActiveSaved = allActive.every((cat) => cat.isSaved);

    // At least one category must be used
    const atLeastOneUsed = activeCategories.some((cat) => cat.isUsed);

    setAllRequiredSaved(allActiveSaved && atLeastOneUsed);
  }, [
    useCustomers,
    customersSaved,
    useSuppliers,
    suppliersSaved,
    useWasteProcessors,
    wasteProcessorsSaved,
    useOutsourcing,
    outsourcingSaved,
  ]);

  // Reset saved status when category is toggled
  useEffect(() => {
    if (!useCustomers) setCustomersSaved(true);
    else if (!customersSaved) setCustomersSaved(false);
  }, [useCustomers, customersSaved]);

  useEffect(() => {
    if (!useSuppliers) setSuppliersSaved(true);
    else if (!suppliersSaved) setSuppliersSaved(false);
  }, [useSuppliers, suppliersSaved]);

  useEffect(() => {
    if (!useWasteProcessors) setWasteProcessorsSaved(true);
    else if (!wasteProcessorsSaved) setWasteProcessorsSaved(false);
  }, [useWasteProcessors, wasteProcessorsSaved]);

  useEffect(() => {
    if (!useOutsourcing) setOutsourcingSaved(true);
    else if (!outsourcingSaved) setOutsourcingSaved(false);
  }, [useOutsourcing, outsourcingSaved]);

  // Save handlers for each component
  const handleSaveCustomers = () => {
    // Validate customers data
    const isValid = customers.every(
      (customer) =>
        customer.name.trim() !== '' && customer.transportation.trim() !== '',
    );

    if (!isValid) {
      alert('업체명, 운송수단 등 필수 항목을 입력해주세요.');
      return;
    }

    console.log('고객사 정보 저장:', customers);
    // API call would go here

    setCustomersSaved(true);
    alert('제품 고객사 정보가 저장되었습니다.');
  };

  const handleSaveSuppliers = () => {
    // Validate suppliers data
    const isValid = suppliers.every(
      (supplier) =>
        supplier.name.trim() !== '' && supplier.transportation.trim() !== '',
    );

    if (!isValid) {
      alert('업체명, 운송수단 등 필수 항목을 입력해주세요.');
      return;
    }

    console.log('공급업체 정보 저장:', suppliers);
    // API call would go here

    setSuppliersSaved(true);
    alert('원부자재, 포장재 공급업체 정보가 저장되었습니다.');
  };

  const handleSaveWasteProcessors = () => {
    // Validate waste processors data
    const isValid = wasteProcessors.every(
      (wasteProcessor) =>
        wasteProcessor.name.trim() !== '' &&
        wasteProcessor.transportation.trim() !== '',
    );

    if (!isValid) {
      alert('업체명, 운송수단 등 필수 항목을 입력해주세요.');
      return;
    }

    console.log('폐기물 처리업체 정보 저장:', wasteProcessors);
    // API call would go here

    setWasteProcessorsSaved(true);
    alert('폐기물 처리업체 정보가 저장되었습니다.');
  };

  const handleSaveOutsourcing = () => {
    // Validate outsourcing data
    const isValid = outsourcingCompanies.every(
      (company) =>
        company.name.trim() !== '' && company.contactName.trim() !== '',
    );

    if (!isValid) {
      alert('외주업체명, 담당자 성명 등 필수 항목을 입력해주세요.');
      return;
    }

    console.log('외주업체 정보 저장:', outsourcingCompanies);
    // API call would go here

    setOutsourcingSaved(true);
    alert('외주업체 정보가 저장되었습니다.');
  };

  // Navigate to next tab
  const handleGoToNext = () => {
    if (onTabChange) {
      onTabChange('purchases');
    }
  };

  // Render save button component
  const renderSaveButton = (
    onSave: () => void,
    isSaved: boolean,
    label: string,
  ) => (
    <div className="flex items-center gap-2">
      {isSaved && (
        <span className="rounded-full bg-green-50 px-2 py-1 text-sm text-green-600">
          저장됨
        </span>
      )}
      <button
        type="button"
        onClick={onSave}
        className={`flex items-center rounded-md px-3 py-1.5 text-sm ${
          isSaved
            ? 'bg-green-100 text-green-700 hover:bg-green-200'
            : 'bg-green-500 text-white hover:bg-green-600'
        }`}
      >
        <FaSave className="mr-1" />
        {label} 저장
      </button>
    </div>
  );

  // 외주업체 렌더링
  const renderOutsourcingSection = () => {
    // 빈 화면 렌더링 (항목이 없을 때)
    if (outsourcingCompanies.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto h-16 w-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <p className="mb-4 text-lg text-gray-600">
            등록된 외주업체가 없습니다.
          </p>
          <p className="mb-6 text-sm text-gray-500">
            아래 버튼을 클릭하여 첫 번째 외주업체를 등록해보세요.
          </p>
          <button
            type="button"
            className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none"
            onClick={handleAddOutsourcing}
          >
            <FaPlus className="mr-2" size={14} />
            <span>외주업체 추가하기</span>
          </button>
        </div>
      );
    }

    const selectedCompany =
      outsourcingCompanies.find(
        (company) => company.id === selectedOutsourcingId,
      ) || null;

    return (
      <>
        {/* 상단 버튼 영역 */}
        <div className="mb-4 flex justify-end gap-2">
          <button
            type="button"
            className="flex items-center rounded-md border border-blue-300 bg-blue-50 px-3 py-2 text-blue-700 hover:bg-blue-100 focus:outline-none"
            onClick={handleAddOutsourcing}
          >
            <FaPlus className="mr-2" size={14} />
            <span>추가</span>
          </button>
        </div>

        {/* 마스터-디테일 레이아웃 */}
        <div className="flex flex-col gap-6 md:flex-row">
          {/* 마스터 뷰 (목록) */}
          <div className="w-full overflow-hidden rounded-md border border-gray-200 md:w-1/3">
            <div className="border-b border-gray-200 bg-blue-100 px-3 py-2">
              <h3 className="font-medium text-blue-800">외주업체 목록</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {outsourcingCompanies.map((company) => (
                <div
                  key={company.id}
                  onClick={() => setSelectedOutsourcingId(company.id)}
                  className={`flex cursor-pointer items-center justify-between border-b border-gray-100 px-3 py-3 hover:bg-gray-50 ${
                    selectedOutsourcingId === company.id
                      ? 'border-l-4 border-l-blue-500 bg-blue-50'
                      : ''
                  }`}
                >
                  <div className="flex-1 truncate">
                    <p
                      className={`font-medium ${company.name ? '' : 'italic text-gray-400'}`}
                    >
                      {company.name || '(이름 없음)'}
                    </p>
                    {company.contactName && (
                      <p className="mt-1 truncate text-xs text-gray-500">
                        담당자: {company.contactName}
                      </p>
                    )}
                  </div>
                  <FaChevronRight size={12} className="text-gray-400" />
                </div>
              ))}
            </div>
          </div>

          {/* 디테일 뷰 (선택된 항목 상세) */}
          <div className="w-full rounded-md border border-gray-200 md:w-2/3">
            {selectedCompany ? (
              <div className="p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-medium">외주업체 정보</h3>
                  <button
                    type="button"
                    className="flex items-center text-red-600 hover:text-red-800"
                    onClick={() => handleDeleteOutsourcing(selectedCompany.id)}
                  >
                    <FaTrash size={14} className="mr-1" />
                    <span className="text-sm">삭제</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {/* 외주업체명 */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      외주업체명 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                      value={selectedCompany.name}
                      onChange={(e) =>
                        handleOutsourcingInputChange('name', e.target.value)
                      }
                      placeholder="외주업체명"
                    />
                  </div>

                  {/* 사업장 주소 */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      사업장 주소
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                      value={selectedCompany.address}
                      onChange={(e) =>
                        handleOutsourcingInputChange('address', e.target.value)
                      }
                      placeholder="사업장 주소"
                    />
                  </div>

                  {/* 담당자 성명 */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      담당자 성명 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                      value={selectedCompany.contactName}
                      onChange={(e) =>
                        handleOutsourcingInputChange(
                          'contactName',
                          e.target.value,
                        )
                      }
                      placeholder="담당자 성명"
                    />
                  </div>

                  {/* 담당자 연락처 */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      담당자 연락처
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                      value={selectedCompany.contactPhone}
                      onChange={(e) =>
                        handleOutsourcingInputChange(
                          'contactPhone',
                          e.target.value,
                        )
                      }
                      placeholder="담당자 연락처 (000-0000-0000)"
                    />
                  </div>

                  {/* 담당자 이메일 */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      담당자 이메일
                    </label>
                    <input
                      type="email"
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                      value={selectedCompany.contactEmail}
                      onChange={(e) =>
                        handleOutsourcingInputChange(
                          'contactEmail',
                          e.target.value,
                        )
                      }
                      placeholder="담당자 이메일"
                    />
                  </div>

                  {/* 파일 첨부 */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      파일 첨부
                    </label>
                    <div className="flex flex-col">
                      <div className="flex space-x-2">
                        <label className="flex cursor-pointer items-center rounded-md border border-blue-300 bg-blue-50 px-3 py-2 text-blue-700 hover:bg-blue-100">
                          <FaUpload className="mr-2" size={14} />
                          <span>파일 선택</span>
                          <input
                            type="file"
                            className="hidden"
                            onChange={handleOutsourcingFileUpload}
                            accept=".pdf,.jpg,.jpeg,.png"
                          />
                        </label>

                        {selectedCompany.file && (
                          <button
                            type="button"
                            className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-red-700 hover:bg-red-100"
                            onClick={handleOutsourcingFileDelete}
                          >
                            <FaTrash size={14} />
                          </button>
                        )}
                      </div>

                      {selectedCompany.file ? (
                        <div className="mt-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2">
                          <span className="break-all text-gray-700">
                            {selectedCompany.file.name}
                          </span>
                        </div>
                      ) : (
                        <p className="mt-2 text-sm text-gray-500">
                          선택된 파일 없음
                        </p>
                      )}

                      <p className="mt-1 text-xs text-gray-500">
                        PDF, JPG, JPEG, PNG 파일 (최대 10MB)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                선택된 외주업체가 없습니다
              </div>
            )}
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="space-y-6">
      {/* 제품 고객사 섹션 */}
      <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
        <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
          <SectionHeader
            title="2-1. 제품 고객사"
            isCollapsed={customersCollapsed}
            isUsed={useCustomers}
            onToggleCollapse={toggleCustomersCollapse}
            onToggleUse={toggleUseCustomers}
          />
          {useCustomers &&
            renderSaveButton(handleSaveCustomers, customersSaved, '고객사')}
        </div>

        {!customersCollapsed && useCustomers && (
          <CompanyItemDetail
            title=""
            items={customers}
            selectedItemId={selectedCustomerId}
            onSelect={setSelectedCustomerId}
            onAdd={handleAddCustomer}
            onDelete={handleDeleteCustomer}
            onInputChange={handleCustomerInputChange}
            onTransportationClick={handleCustomerTransportationClick}
            onFileUpload={handleCustomerFileUpload}
            onFileDelete={handleCustomerFileDelete}
          />
        )}

        {!useCustomers && (
          <div className="rounded bg-gray-100 py-4 text-center text-gray-500">
            이 카테고리는 사용하지 않도록 설정되었습니다.
          </div>
        )}

        {customersCollapsed && useCustomers && (
          <div className="py-2 text-center text-gray-500">
            펼치기 버튼을 클릭하여 내용을 확인하세요.
          </div>
        )}
      </div>

      {/* 원부자재, 포장재 공급업체 섹션 */}
      <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
        <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
          <SectionHeader
            title="2-2. 원부자재, 포장재 공급업체"
            isCollapsed={suppliersCollapsed}
            isUsed={useSuppliers}
            onToggleCollapse={toggleSuppliersCollapse}
            onToggleUse={toggleUseSuppliers}
          />
          {useSuppliers &&
            renderSaveButton(handleSaveSuppliers, suppliersSaved, '공급업체')}
        </div>

        {!suppliersCollapsed && useSuppliers && (
          <CompanyItemDetail
            title=""
            items={suppliers}
            selectedItemId={selectedSupplierId}
            onSelect={setSelectedSupplierId}
            onAdd={handleAddSupplier}
            onDelete={handleDeleteSupplier}
            onInputChange={handleSupplierInputChange}
            onTransportationClick={handleSupplierTransportationClick}
            onFileUpload={handleSupplierFileUpload}
            onFileDelete={handleSupplierFileDelete}
          />
        )}

        {!useSuppliers && (
          <div className="rounded bg-gray-100 py-4 text-center text-gray-500">
            이 카테고리는 사용하지 않도록 설정되었습니다.
          </div>
        )}

        {suppliersCollapsed && useSuppliers && (
          <div className="py-2 text-center text-gray-500">
            펼치기 버튼을 클릭하여 내용을 확인하세요.
          </div>
        )}
      </div>

      {/* 폐기물 처리업체 섹션 */}
      <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
        <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
          <SectionHeader
            title="2-3. 폐기물 처리업체"
            isCollapsed={wasteProcessorsCollapsed}
            isUsed={useWasteProcessors}
            onToggleCollapse={toggleWasteProcessorsCollapse}
            onToggleUse={toggleUseWasteProcessors}
          />
          {useWasteProcessors &&
            renderSaveButton(
              handleSaveWasteProcessors,
              wasteProcessorsSaved,
              '폐기물 처리업체',
            )}
        </div>

        {!wasteProcessorsCollapsed && useWasteProcessors && (
          <CompanyItemDetail
            title=""
            items={wasteProcessors}
            selectedItemId={selectedWasteProcessorId}
            onSelect={setSelectedWasteProcessorId}
            onAdd={handleAddWasteProcessor}
            onDelete={handleDeleteWasteProcessor}
            onInputChange={handleWasteProcessorInputChange}
            onTransportationClick={handleWasteProcessorTransportationClick}
            onFileUpload={handleWasteProcessorFileUpload}
            onFileDelete={handleWasteProcessorFileDelete}
          />
        )}

        {!useWasteProcessors && (
          <div className="rounded bg-gray-100 py-4 text-center text-gray-500">
            이 카테고리는 사용하지 않도록 설정되었습니다.
          </div>
        )}

        {wasteProcessorsCollapsed && useWasteProcessors && (
          <div className="py-2 text-center text-gray-500">
            펼치기 버튼을 클릭하여 내용을 확인하세요.
          </div>
        )}
      </div>

      {/* 외주업체 섹션 */}
      <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
        <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
          <SectionHeader
            title="2-4. 외주업체"
            isCollapsed={outsourcingCollapsed}
            isUsed={useOutsourcing}
            onToggleCollapse={toggleOutsourcingCollapse}
            onToggleUse={toggleUseOutsourcing}
          />
          {useOutsourcing &&
            renderSaveButton(
              handleSaveOutsourcing,
              outsourcingSaved,
              '외주업체',
            )}
        </div>

        {!outsourcingCollapsed && useOutsourcing && renderOutsourcingSection()}

        {!useOutsourcing && (
          <div className="rounded bg-gray-100 py-4 text-center text-gray-500">
            이 카테고리는 사용하지 않도록 설정되었습니다.
          </div>
        )}

        {outsourcingCollapsed && useOutsourcing && (
          <div className="py-2 text-center text-gray-500">
            펼치기 버튼을 클릭하여 내용을 확인하세요.
          </div>
        )}
      </div>

      {/* 하단 다음 버튼 */}
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          className={`rounded-md px-6 py-2 focus:outline-none ${
            allRequiredSaved
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'cursor-not-allowed bg-gray-300 text-gray-500'
          }`}
          onClick={allRequiredSaved ? handleGoToNext : undefined}
          disabled={!allRequiredSaved}
        >
          다음
        </button>
      </div>

      {/* 운송수단 선택 모달 */}
      <TransportationModal
        isOpen={showTransportationModal}
        onClose={() => setShowTransportationModal(false)}
        onSelect={handleTransportationSelect}
      />
    </div>
  );
}
