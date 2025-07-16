'use client';

import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp, FaPlus, FaSave } from 'react-icons/fa';
import PurchasesToolbar from './PurchasesToolbar';
import MaterialMobileForm from './MaterialMobileForm';
import MaterialDeskTopForm from './MaterialDeskTopForm';
import PackagingMobileForm from './PackagingMobileForm';
import PackagingDeskTopForm from './PackagingDeskTopForm';
import EnergyTabContent from './energy/EnergyTabContent';
import UtilitiesTabContent from './utilities/UtilitiesTabContent';
import WasteGasTabContent from './waste-gas/WasteGasTabContent';

// 원자재 인터페이스 정의
interface Material {
  id: number;
  name: string; // (1) 원자재명
  emissionCoefProvided: 'O' | 'X' | ''; // (2) 배출계수 제공 여부
  databaseType: 'O' | 'X' | ''; // (3) Database 유무
  physicalForm: '단일물질' | '혼합물' | ''; // (4) 물질정보
  materialInfo: string; // (5) 재질정보
  casNumber: string; // (6) CAS No.
  concentration: string; // (7) 농도 (%)
  unit: string; // (8) 단위
  weightConversionFactor: number; // (9) 단위 당 중량 (kg/단위)
  bioMassType: 'O' | 'X' | ''; // (10) 바이오매스 여부
  bioMassRatio: number; // (11) 함량 (%)
  emissionCoef: string; // (12) 배출계수
  emissionUnit: string; // (13) 배출계수 단위
  suppliers: string[]; // (14) 공급업체 - 다중선택 가능하도록 배열로 변경
  fileAttachment: File | null; // (15) 파일첨부
  inputAmount: number; // 투입량
  totalAmount: number; // 환산합계
}

// 혼합물 구성성분 인터페이스
interface MaterialComponent {
  id: number;
  materialId: number; // 소속된 원자재 ID
  name: string; // 재질정보
  casNumber: string; // CAS No.
  unit: string; // 단위
  inputAmount: number; // 투입량
  ratio: number; // 비율 (%)
  totalAmount: number; // 환산합계
}

// 포장재 인터페이스 정의
interface PackagingMaterial {
  id: number;
  name: string; // (1) 포장재명
  materialInfo: string; // (2) 재질정보
  casNumber: string; // (3) CAS No.
  unit: string; // (4) 단위
  weightConversionFactor: number; // (5) 단위 당 중량 (kg/단위)
  suppliers: string[]; // (6) 공급업체
}

// 기본 공급업체 목록 (자식 컴포넌트들에서 사용)
const DEFAULT_SUPPLIERS = [
  '2.2 - (1) 공급업체명 (다중선택)',
  'A 포장',
  'B 패키징',
  'C 솔루션',
  'D 플라스틱',
  'E 제지',
];

// 탭 인터페이스
interface PurchasesTabContentProps {
  selectedProgram?: string;
  siteId?: string;
  onTabChange?: (tabId: string) => void;
}

const PurchasesTabContent: React.FC<PurchasesTabContentProps> = ({
  selectedProgram,
  siteId,
  onTabChange,
}) => {
  // 원자재 상태 관리
  const [materials, setMaterials] = useState<Material[]>([
    {
      id: 1,
      name: '',
      emissionCoefProvided: '',
      databaseType: '',
      physicalForm: '단일물질',
      materialInfo: '',
      casNumber: '',
      concentration: '',
      unit: 'kg',
      weightConversionFactor: 1,
      bioMassType: '',
      bioMassRatio: 0,
      emissionCoef: '',
      emissionUnit: '',
      suppliers: [],
      fileAttachment: null,
      inputAmount: 1,
      totalAmount: 1,
    },
  ]);

  // 부자재 상태 관리
  const [subsidiaryMaterials, setSubsidiaryMaterials] = useState<Material[]>([
    {
      id: 1,
      name: '',
      emissionCoefProvided: '',
      databaseType: '',
      physicalForm: '단일물질',
      materialInfo: '',
      casNumber: '',
      concentration: '',
      unit: 'kg',
      weightConversionFactor: 1,
      bioMassType: '',
      bioMassRatio: 0,
      emissionCoef: '',
      emissionUnit: '',
      suppliers: [],
      fileAttachment: null,
      inputAmount: 1,
      totalAmount: 1,
    },
  ]);

  // 포장재 상태 관리
  const [packagingMaterials, setPackagingMaterials] = useState<
    PackagingMaterial[]
  >([
    {
      id: 1,
      name: '',
      materialInfo: '',
      casNumber: '',
      unit: 'kg',
      weightConversionFactor: 1,
      suppliers: [],
    },
  ]);

  // 혼합물 구성성분 상태 관리 (원자재용)
  const [materialComponents, setMaterialComponents] = useState<
    MaterialComponent[]
  >([]);
  // 부자재 구성성분 상태 관리
  const [subsidiaryMaterialComponents, setSubsidiaryMaterialComponents] =
    useState<MaterialComponent[]>([]);

  // 섹션 접기/펼치기 상태
  const [sectionCollapsed, setSectionCollapsed] = useState(false);

  // 현재 선택된 원자재 ID
  const [selectedMaterialId, setSelectedMaterialId] = useState<number | null>(
    1
  );
  // 현재 선택된 부자재 ID
  const [selectedSubsidiaryMaterialId, setSelectedSubsidiaryMaterialId] =
    useState<number | null>(1);
  // 현재 선택된 포장재 ID
  const [selectedPackagingMaterialId, setSelectedPackagingMaterialId] =
    useState<number | null>(1);

  // 데이터베이스 검색 상태 (원자재용)
  const [databaseSearchTerm, setDatabaseSearchTerm] = useState('');
  // 부자재 데이터베이스 검색 상태
  const [subsidiaryDatabaseSearchTerm, setSubsidiaryDatabaseSearchTerm] =
    useState('');

  // 저장 상태 관리
  const [materialsSaved, setMaterialsSaved] = useState<boolean>(false);
  const [subsidiaryMaterialsSaved, setSubsidiaryMaterialsSaved] = useState<boolean>(false);
  const [packagingMaterialsSaved, setPackagingMaterialsSaved] = useState<boolean>(false);

  // 컴포넌트 마운트 시 초기 데이터 로드
  useEffect(() => {
    if (siteId) {
      console.log(
        `사이트 ID ${siteId}에 대한 원부자재 및 포장재 데이터를 로드합니다.`
      );
    }
  }, [siteId, selectedProgram]);

  // 새 원자재 추가 핸들러
  const handleAddMaterial = () => {
    const newId =
      materials.length > 0 ? Math.max(...materials.map((m) => m.id)) + 1 : 1;
    const newMaterial: Material = {
      id: newId,
      name: '',
      emissionCoefProvided: '',
      databaseType: '',
      physicalForm: '단일물질',
      materialInfo: '',
      casNumber: '',
      concentration: '',
      unit: 'kg',
      weightConversionFactor: 1,
      bioMassType: '',
      bioMassRatio: 0,
      emissionCoef: '',
      emissionUnit: '',
      suppliers: [],
      fileAttachment: null,
      inputAmount: 1,
      totalAmount: 1,
    };
    setMaterials([...materials, newMaterial]);
    setSelectedMaterialId(newId);
  };

  // 새 부자재 추가 핸들러
  const handleAddSubsidiaryMaterial = () => {
    const newId =
      subsidiaryMaterials.length > 0
        ? Math.max(...subsidiaryMaterials.map((m) => m.id)) + 1
        : 1;
    const newMaterial: Material = {
      id: newId,
      name: '',
      emissionCoefProvided: '',
      databaseType: '',
      physicalForm: '단일물질',
      materialInfo: '',
      casNumber: '',
      concentration: '',
      unit: 'kg',
      weightConversionFactor: 1,
      bioMassType: '',
      bioMassRatio: 0,
      emissionCoef: '',
      emissionUnit: '',
      suppliers: [],
      fileAttachment: null,
      inputAmount: 1,
      totalAmount: 1,
    };
    setSubsidiaryMaterials([...subsidiaryMaterials, newMaterial]);
    setSelectedSubsidiaryMaterialId(newId);
  };

  // 새 포장재 추가 핸들러
  const handleAddPackagingMaterial = () => {
    const newId =
      packagingMaterials.length > 0
        ? Math.max(...packagingMaterials.map((m) => m.id)) + 1
        : 1;
    const newPackaging: PackagingMaterial = {
      id: newId,
      name: '',
      materialInfo: '',
      casNumber: '',
      unit: 'kg',
      weightConversionFactor: 1,
      suppliers: [],
    };
    setPackagingMaterials([...packagingMaterials, newPackaging]);
    setSelectedPackagingMaterialId(newId);
  };

  // 원자재 삭제 핸들러
  const handleDeleteMaterial = (id: number) => {
    if (materials.length <= 1) {
      alert('최소 1개 이상의 원자재 정보가 필요합니다.');
      return;
    }
    if (!confirm('선택한 원자재를 삭제하시겠습니까?')) {
      return;
    }
    const filtered = materials.filter((m) => m.id !== id);
    setMaterials(filtered);
    setMaterialComponents((prev) =>
      prev.filter((comp) => comp.materialId !== id)
    );
    if (id === selectedMaterialId) {
      setSelectedMaterialId(filtered.length > 0 ? filtered[0].id : null);
    }
  };

  // 부자재 삭제 핸들러
  const handleDeleteSubsidiaryMaterial = (id: number) => {
    if (subsidiaryMaterials.length <= 1) {
      alert('최소 1개 이상의 부자재 정보가 필요합니다.');
      return;
    }
    if (!confirm('선택한 부자재를 삭제하시겠습니까?')) {
      return;
    }
    const filtered = subsidiaryMaterials.filter((m) => m.id !== id);
    setSubsidiaryMaterials(filtered);
    setSubsidiaryMaterialComponents((prev) =>
      prev.filter((comp) => comp.materialId !== id)
    );
    if (id === selectedSubsidiaryMaterialId) {
      setSelectedSubsidiaryMaterialId(
        filtered.length > 0 ? filtered[0].id : null
      );
    }
  };

  // 포장재 삭제 핸들러
  const handleDeletePackagingMaterial = (id: number) => {
    if (packagingMaterials.length <= 1) {
      alert('최소 1개 이상의 포장재 정보가 필요합니다.');
      return;
    }
    if (!confirm('선택한 포장재를 삭제하시겠습니까?')) {
      return;
    }
    const filtered = packagingMaterials.filter((m) => m.id !== id);
    setPackagingMaterials(filtered);
    if (id === selectedPackagingMaterialId) {
      setSelectedPackagingMaterialId(
        filtered.length > 0 ? filtered[0].id : null
      );
    }
  };

  // 입력값 변경 핸들러 - 원자재
  const handleInputChange = (
    id: number,
    field: keyof Material,
    value: string | number | File | null | string[]
  ) => {
    setMaterials((prev) =>
      prev.map((material) => {
        if (material.id !== id) return material;
        const updatedMaterial = { ...material, [field]: value };
        // 필드별 특수 로직
        if (field === 'emissionCoefProvided') {
          if (value === 'O') {
            updatedMaterial.databaseType = 'X';
            updatedMaterial.emissionUnit = `kg/${updatedMaterial.unit}`;
          } else if (value === 'X') {
            updatedMaterial.emissionCoef = '';
            updatedMaterial.emissionUnit = '';
          }
        }
        if (field === 'name' && value && typeof value === 'string') {
          const hasInDatabase = value.toLowerCase().includes('db');
          updatedMaterial.databaseType = hasInDatabase ? 'O' : 'X';
          if (material.emissionCoefProvided === 'O') {
            updatedMaterial.databaseType = 'X';
          }
        }
        if (field === 'databaseType') {
          if (value === 'O') {
            updatedMaterial.physicalForm = '단일물질';
            setMaterialComponents((prevComp) =>
              prevComp.filter((comp) => comp.materialId !== id)
            );
          }
        }
        if (field === 'physicalForm' && value === '단일물질') {
          setMaterialComponents((prevComp) =>
            prevComp.filter((comp) => comp.materialId !== id)
          );
        }
        if (field === 'bioMassType') {
          if (value === 'X') updatedMaterial.bioMassRatio = 0;
        }
        if (
          field === 'unit' ||
          field === 'inputAmount' ||
          field === 'weightConversionFactor'
        ) {
          updatedMaterial.totalAmount = calculateTotalAmount(
            Number(updatedMaterial.inputAmount) || 0,
            updatedMaterial.weightConversionFactor
          );
          if (
            field === 'unit' &&
            updatedMaterial.emissionCoefProvided === 'O'
          ) {
            updatedMaterial.emissionUnit = `kg/${updatedMaterial.unit}`;
          }
        }
        return updatedMaterial;
      })
    );
  };

  // 입력값 변경 핸들러 - 부자재 (handleInputChange와 유사하게 Material 타입 사용)
  const handleSubsidiaryInputChange = (
    id: number,
    field: keyof Material,
    value: string | number | File | null | string[]
  ) => {
    setSubsidiaryMaterials((prev) =>
      prev.map((material) => {
        if (material.id !== id) return material;
        const updatedMaterial = { ...material, [field]: value };
        // 필드별 특수 로직
        if (field === 'emissionCoefProvided') {
          if (value === 'O') {
            updatedMaterial.databaseType = 'X';
            updatedMaterial.emissionUnit = `kg/${updatedMaterial.unit}`;
          } else if (value === 'X') {
            updatedMaterial.emissionCoef = '';
            updatedMaterial.emissionUnit = '';
          }
        }
        if (field === 'name' && value && typeof value === 'string') {
          const hasInDatabase = value.toLowerCase().includes('db');
          updatedMaterial.databaseType = hasInDatabase ? 'O' : 'X';
          if (material.emissionCoefProvided === 'O') {
            updatedMaterial.databaseType = 'X';
          }
        }
        if (field === 'databaseType') {
          if (value === 'O') {
            updatedMaterial.physicalForm = '단일물질';
            setSubsidiaryMaterialComponents((prevComp) =>
              prevComp.filter((comp) => comp.materialId !== id)
            );
          }
        }
        if (field === 'physicalForm' && value === '단일물질') {
          setSubsidiaryMaterialComponents((prevComp) =>
            prevComp.filter((comp) => comp.materialId !== id)
          );
        }
        if (field === 'bioMassType') {
          if (value === 'X') updatedMaterial.bioMassRatio = 0;
        }
        if (
          field === 'unit' ||
          field === 'inputAmount' ||
          field === 'weightConversionFactor'
        ) {
          updatedMaterial.totalAmount = calculateTotalAmount(
            Number(updatedMaterial.inputAmount) || 0,
            updatedMaterial.weightConversionFactor
          );
          if (
            field === 'unit' &&
            updatedMaterial.emissionCoefProvided === 'O'
          ) {
            updatedMaterial.emissionUnit = `kg/${updatedMaterial.unit}`;
          }
        }
        return updatedMaterial;
      })
    );
  };

  // 입력값 변경 핸들러 - 포장재
  const handlePackagingInputChange = (
    id: number,
    field: keyof PackagingMaterial,
    value: string | number | string[]
  ) => {
    setPackagingMaterials((prev) =>
      prev.map((material) =>
        material.id === id ? { ...material, [field]: value } : material
      )
    );
  };

  // 구성성분 추가 핸들러 - 원자재
  const handleAddComponent = (materialId: number) => {
    const material = materials.find((m) => m.id === materialId);
    if (!material || material.physicalForm !== '혼합물') return;
    const newComponentId =
      materialComponents.length > 0
        ? Math.max(...materialComponents.map((c) => c.id)) + 1
        : 1;
    const newComponent: MaterialComponent = {
      id: newComponentId,
      materialId,
      name: '',
      casNumber: '',
      unit: 'kg',
      inputAmount: 0,
      ratio: 0,
      totalAmount: 0,
    };
    setMaterialComponents([...materialComponents, newComponent]);
  };

  // 구성성분 삭제 핸들러 - 원자재
  const handleDeleteComponent = (componentId: number) => {
    setMaterialComponents((prev) =>
      prev.filter((comp) => comp.id !== componentId)
    );
  };

  // 구성성분 입력값 변경 핸들러 - 원자재
  const handleComponentInputChange = (
    componentId: number,
    field: keyof MaterialComponent,
    value: string | number
  ) => {
    setMaterialComponents((prev) =>
      prev.map((component) => {
        if (component.id !== componentId) return component;
        const updatedComponent = { ...component, [field]: value };
        if (field === 'unit' || field === 'inputAmount' || field === 'ratio') {
          updatedComponent.totalAmount = calculateComponentTotalAmount(
            Number(updatedComponent.inputAmount) || 0,
            Number(updatedComponent.ratio) || 0
          );
        }
        return updatedComponent;
      })
    );
  };

  // 구성성분 추가 핸들러 - 부자재
  const handleAddSubsidiaryComponent = (materialId: number) => {
    const material = subsidiaryMaterials.find((m) => m.id === materialId);
    if (!material || material.physicalForm !== '혼합물') return;
    const newComponentId =
      subsidiaryMaterialComponents.length > 0
        ? Math.max(...subsidiaryMaterialComponents.map((c) => c.id)) + 1
        : 1;
    const newComponent: MaterialComponent = {
      id: newComponentId,
      materialId,
      name: '',
      casNumber: '',
      unit: 'kg',
      inputAmount: 0,
      ratio: 0,
      totalAmount: 0,
    };
    setSubsidiaryMaterialComponents([
      ...subsidiaryMaterialComponents,
      newComponent,
    ]);
  };

  // 구성성분 삭제 핸들러 - 부자재
  const handleDeleteSubsidiaryComponent = (componentId: number) => {
    setSubsidiaryMaterialComponents((prev) =>
      prev.filter((comp) => comp.id !== componentId)
    );
  };

  // 구성성분 입력값 변경 핸들러 - 부자재
  const handleSubsidiaryComponentInputChange = (
    componentId: number,
    field: keyof MaterialComponent,
    value: string | number
  ) => {
    setSubsidiaryMaterialComponents((prev) =>
      prev.map((component) => {
        if (component.id !== componentId) return component;
        const updatedComponent = { ...component, [field]: value };
        if (field === 'unit' || field === 'inputAmount' || field === 'ratio') {
          updatedComponent.totalAmount = calculateComponentTotalAmount(
            Number(updatedComponent.inputAmount) || 0,
            Number(updatedComponent.ratio) || 0
          );
        }
        return updatedComponent;
      })
    );
  };

  // 파일 업로드 핸들러 - 원자재
  const handleFileUpload = (
    id: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      handleInputChange(id, 'fileAttachment', e.target.files[0]);
    }
  };

  // 파일 삭제 핸들러 - 원자재
  const handleFileDelete = (id: number) => {
    handleInputChange(id, 'fileAttachment', null);
  };

  // 파일 업로드 핸들러 - 부자재
  const handleSubsidiaryFileUpload = (
    id: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      handleSubsidiaryInputChange(id, 'fileAttachment', e.target.files[0]);
    }
  };

  // 파일 삭제 핸들러 - 부자재
  const handleSubsidiaryFileDelete = (id: number) => {
    handleSubsidiaryInputChange(id, 'fileAttachment', null);
  };

  // 총량 계산 함수
  const calculateTotalAmount = (
    inputAmount: number,
    weightConversionFactor: number
  ): number => {
    return inputAmount * weightConversionFactor;
  };

  // 구성성분 총량 계산 함수
  const calculateComponentTotalAmount = (
    inputAmount: number,
    ratio: number
  ): number => {
    return inputAmount * (ratio / 100);
  };

  // 데이터베이스 검색 핸들러 - 원자재
  const handleRawMaterialDatabaseSearch = () => {
    if (!databaseSearchTerm.trim()) {
      alert('검색어를 입력해주세요.');
      return;
    }
    console.log(`원자재 데이터베이스 검색: ${databaseSearchTerm}`);
    setTimeout(() => {
      alert('검색 결과가 없습니다.');
    }, 1000);
  };

  // 데이터베이스 검색 핸들러 - 부자재
  const handleSubsidiaryDatabaseSearch = () => {
    if (!subsidiaryDatabaseSearchTerm.trim()) {
      alert('검색어를 입력해주세요.');
      return;
    }
    console.log(`부자재 데이터베이스 검색: ${subsidiaryDatabaseSearchTerm}`);
    setTimeout(() => {
      alert('검색 결과가 없습니다.');
    }, 1000);
  };

  // 원자재 저장 핸들러
  const handleSaveMaterials = () => {
    // 원자재 유효성 검사
    const isMaterialValid = materials.every(
      (m) =>
        m.name.trim() !== '' &&
        m.emissionCoefProvided !== '' &&
        m.databaseType !== ''
    );
    if (!isMaterialValid) {
      alert('원자재 필수 항목을 모두 입력해주세요.');
      return;
    }

    // 원자재 혼합물 검증
    const mixtureMaterialIds = materials
      .filter((m) => m.physicalForm === '혼합물')
      .map((m) => m.id);
    for (const mixtureId of mixtureMaterialIds) {
      const mixtureComponents = materialComponents.filter(
        (comp) => comp.materialId === mixtureId
      );
      if (mixtureComponents.length === 0) {
        alert(
          `혼합물로 설정된 원자재 '${
            materials.find((m) => m.id === mixtureId)?.name || mixtureId
          }'의 구성성분을 추가해주세요.`
        );
        return;
      }
      const mixtureRatioSum = mixtureComponents.reduce(
        (sum, comp) => sum + Number(comp.ratio || 0),
        0
      );
      if (Math.abs(mixtureRatioSum - 100) > 0.1) {
        alert(
          `'${
            materials.find((m) => m.id === mixtureId)?.name || mixtureId
          }' 혼합물의 구성성분 비율의 합이 100%가 아닙니다. (현재: ${mixtureRatioSum.toFixed(
            1
          )}%)`
        );
        return;
      }
    }

    console.log('저장할 원자재 데이터:', {
      materials,
      materialComponents,
    });
    
    setMaterialsSaved(true);
    alert('원자재 정보가 저장되었습니다.');
  };

  // 부자재 저장 핸들러
  const handleSaveSubsidiaryMaterials = () => {
    // 부자재 유효성 검사
    const isSubsidiaryMaterialValid = subsidiaryMaterials.every(
      (m) =>
        m.name.trim() !== '' &&
        m.emissionCoefProvided !== '' &&
        m.databaseType !== ''
    );
    if (!isSubsidiaryMaterialValid) {
      alert('부자재 필수 항목을 모두 입력해주세요.');
      return;
    }

    // 부자재 혼합물 검증
    const mixtureSubsidiaryIds = subsidiaryMaterials
      .filter((m) => m.physicalForm === '혼합물')
      .map((m) => m.id);
    for (const mixtureId of mixtureSubsidiaryIds) {
      const mixtureComponents = subsidiaryMaterialComponents.filter(
        (comp) => comp.materialId === mixtureId
      );
      if (mixtureComponents.length === 0) {
        alert(
          `혼합물로 설정된 부자재 '${
            subsidiaryMaterials.find((m) => m.id === mixtureId)?.name ||
            mixtureId
          }'의 구성성분을 추가해주세요.`
        );
        return;
      }
      const mixtureRatioSum = mixtureComponents.reduce(
        (sum, comp) => sum + Number(comp.ratio || 0),
        0
      );
      if (Math.abs(mixtureRatioSum - 100) > 0.1) {
        alert(
          `'${
            subsidiaryMaterials.find((m) => m.id === mixtureId)?.name ||
            mixtureId
          }' 혼합물의 구성성분 비율의 합이 100%가 아닙니다. (현재: ${mixtureRatioSum.toFixed(
            1
          )}%)`
        );
        return;
      }
    }

    console.log('저장할 부자재 데이터:', {
      subsidiaryMaterials,
      subsidiaryMaterialComponents,
    });
    
    setSubsidiaryMaterialsSaved(true);
    alert('부자재 정보가 저장되었습니다.');
  };

  // 포장재 저장 핸들러
  const handleSavePackagingMaterials = () => {
    // 포장재 유효성 검사 (포장재명 필수)
    const isPackagingMaterialValid = packagingMaterials.every(
      (m) => m.name.trim() !== ''
    );
    if (!isPackagingMaterialValid) {
      alert('포장재 필수 항목 (포장재명)을 모두 입력해주세요.');
      return;
    }

    console.log('저장할 포장재 데이터:', {
      packagingMaterials,
    });
    
    setPackagingMaterialsSaved(true);
    alert('포장재 정보가 저장되었습니다.');
  };

  // 다음 탭으로 이동 조건 확인
  useEffect(() => {
    if (materialsSaved && subsidiaryMaterialsSaved && packagingMaterialsSaved) {
      // 모든 섹션이 저장되었을 때 자동으로 다음 탭으로 이동하려면 주석 해제
      // if (onTabChange) onTabChange('process');
    }
  }, [materialsSaved, subsidiaryMaterialsSaved, packagingMaterialsSaved, onTabChange]);

  // 저장 버튼 렌더링 함수
  const renderSaveButton = (
    onSave: () => void,
    isSaved: boolean,
    label: string
  ) => (
    <div className='flex items-center gap-2'>
      {isSaved && (
        <span className='text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full'>
          저장됨
        </span>
      )}
      <button
        type='button'
        onClick={onSave}
        className={`px-3 py-1.5 rounded-md text-sm flex items-center ${
          isSaved
            ? 'bg-green-100 text-green-700 hover:bg-green-200'
            : 'bg-green-500 text-white hover:bg-green-600'
        }`}
      >
        <FaSave className='mr-1' />
        {label} 저장
      </button>
    </div>
  );

  // 원자재 선택 핸들러
  const handleSelectMaterial = (id: number) => setSelectedMaterialId(id);
  // 부자재 선택 핸들러
  const handleSelectSubsidiaryMaterial = (id: number) =>
    setSelectedSubsidiaryMaterialId(id);
  // 포장재 선택 핸들러
  const handleSelectPackagingMaterial = (id: number) =>
    setSelectedPackagingMaterialId(id);

  // 선택된 원자재의 구성성분 가져오기
  const getComponentsForMaterial = (materialId: number): MaterialComponent[] =>
    materialComponents.filter((comp) => comp.materialId === materialId);
  // 선택된 부자재의 구성성분 가져오기
  const getComponentsForSubsidiaryMaterial = (
    materialId: number
  ): MaterialComponent[] =>
    subsidiaryMaterialComponents.filter(
      (comp) => comp.materialId === materialId
    );

  // 단위 옵션
  const unitOptions = ['kg', 'ton', '개', 'L', 'm', 'm²', 'm³'];
  // 물질 형태 옵션 (원자재/부자재용)
  const physicalFormOptions = ['단일물질', '혼합물'];

  return (
    <div className='space-y-6'>
      {/* 원부자재 섹션 */}
      <div className='bg-white rounded-lg shadow-md p-6'>
        <div className='flex justify-between items-center mb-4'>
          <div className='flex items-center space-x-2'>
            <h2 className='text-xl font-semibold text-gray-800'>
              3-1. 원부자재 및 포장재
            </h2>
            <button
              type='button'
              className='p-1 text-gray-500 hover:text-gray-700 focus:outline-none'
              onClick={() => setSectionCollapsed(!sectionCollapsed)}
              aria-label={sectionCollapsed ? '펼치기' : '접기'}
            >
              {sectionCollapsed ? <FaChevronDown /> : <FaChevronUp />}
            </button>
          </div>
        </div>

        {!sectionCollapsed && (
          <>
            {/* (1) 원자재 섹션 */}
            <div>
              <div className='flex justify-between items-center mb-4'>
                <h3 className='text-lg font-medium'>(1) 원자재</h3>
                {renderSaveButton(handleSaveMaterials, materialsSaved, "원자재")}
              </div>
              <PurchasesToolbar
                searchTerm={databaseSearchTerm}
                onSearchTermChange={setDatabaseSearchTerm}
                onSearch={handleRawMaterialDatabaseSearch}
                onAddMaterial={handleAddMaterial}
              />
              <div className='lg:hidden'>
                <div className='mb-4'>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    원자재 목록
                  </label>
                  <select
                    className='w-full p-2 border border-gray-300 rounded-md'
                    value={selectedMaterialId || ''}
                    onChange={(e) =>
                      handleSelectMaterial(Number(e.target.value))
                    }
                  >
                    {materials.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name || `원자재 ${m.id}`}
                      </option>
                    ))}
                  </select>
                </div>
                {selectedMaterialId && (
                  <MaterialMobileForm
                    material={materials.find(
                      (m) => m.id === selectedMaterialId
                    )}
                    components={getComponentsForMaterial(selectedMaterialId)}
                    unitOptions={unitOptions}
                    physicalFormOptions={physicalFormOptions}
                    onDelete={handleDeleteMaterial}
                    onInputChange={handleInputChange}
                    onFileUpload={handleFileUpload}
                    onFileDelete={handleFileDelete}
                    onAddComponent={handleAddComponent}
                    onDeleteComponent={handleDeleteComponent}
                    onComponentInputChange={handleComponentInputChange}
                    defaultSuppliers={DEFAULT_SUPPLIERS}
                  />
                )}
              </div>
              <MaterialDeskTopForm
                materials={materials}
                selectedMaterialId={selectedMaterialId}
                unitOptions={unitOptions}
                physicalFormOptions={physicalFormOptions}
                components={materialComponents}
                onSelectMaterial={handleSelectMaterial}
                onInputChange={handleInputChange}
                onDeleteMaterial={handleDeleteMaterial}
                onFileUpload={handleFileUpload}
                onFileDelete={handleFileDelete}
                onAddComponent={handleAddComponent}
                onDeleteComponent={handleDeleteComponent}
                onComponentInputChange={handleComponentInputChange}
                defaultSuppliers={DEFAULT_SUPPLIERS}
              />
            </div>

            {/* (2) 부자재 섹션 */}
            <div className='mt-10'>
              <div className='flex justify-between items-center mb-4'>
                <h3 className='text-lg font-medium'>
                  (2) 부자재
                  <span className='ml-4 text-sm font-normal text-red-600'>
                    대기 방지시설에서 사용하는 탄산염 또는 요소수가 있는 경우
                    반드시 기재해 주시기 바랍니다.
                  </span>
                </h3>
                {renderSaveButton(handleSaveSubsidiaryMaterials, subsidiaryMaterialsSaved, "부자재")}
              </div>
              <PurchasesToolbar
                searchTerm={subsidiaryDatabaseSearchTerm}
                onSearchTermChange={setSubsidiaryDatabaseSearchTerm}
                onSearch={handleSubsidiaryDatabaseSearch}
                onAddMaterial={handleAddSubsidiaryMaterial}
              />
              <div className='lg:hidden'>
                <div className='mb-4'>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    부자재 목록
                  </label>
                  <select
                    className='w-full p-2 border border-gray-300 rounded-md'
                    value={selectedSubsidiaryMaterialId || ''}
                    onChange={(e) =>
                      handleSelectSubsidiaryMaterial(Number(e.target.value))
                    }
                  >
                    {subsidiaryMaterials.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name || `부자재 ${m.id}`}
                      </option>
                    ))}
                  </select>
                </div>
                {selectedSubsidiaryMaterialId && (
                  <MaterialMobileForm
                    material={subsidiaryMaterials.find(
                      (m) => m.id === selectedSubsidiaryMaterialId
                    )}
                    components={getComponentsForSubsidiaryMaterial(
                      selectedSubsidiaryMaterialId
                    )}
                    unitOptions={unitOptions}
                    physicalFormOptions={physicalFormOptions}
                    onDelete={handleDeleteSubsidiaryMaterial}
                    onInputChange={handleSubsidiaryInputChange}
                    onFileUpload={handleSubsidiaryFileUpload}
                    onFileDelete={handleSubsidiaryFileDelete}
                    onAddComponent={handleAddSubsidiaryComponent}
                    onDeleteComponent={handleDeleteSubsidiaryComponent}
                    onComponentInputChange={
                      handleSubsidiaryComponentInputChange
                    }
                    defaultSuppliers={DEFAULT_SUPPLIERS}
                  />
                )}
              </div>
              <MaterialDeskTopForm
                materials={subsidiaryMaterials}
                selectedMaterialId={selectedSubsidiaryMaterialId}
                unitOptions={unitOptions}
                physicalFormOptions={physicalFormOptions}
                components={subsidiaryMaterialComponents}
                onSelectMaterial={handleSelectSubsidiaryMaterial}
                onInputChange={handleSubsidiaryInputChange}
                onDeleteMaterial={handleDeleteSubsidiaryMaterial}
                onFileUpload={handleSubsidiaryFileUpload}
                onFileDelete={handleSubsidiaryFileDelete}
                onAddComponent={handleAddSubsidiaryComponent}
                onDeleteComponent={handleDeleteSubsidiaryComponent}
                onComponentInputChange={handleSubsidiaryComponentInputChange}
                defaultSuppliers={DEFAULT_SUPPLIERS}
              />
            </div>

            {/* (3) 포장재 섹션 */}
            <div className='mt-10'>
              <div className='flex justify-between items-center mb-4'>
                <h3 className='text-lg font-medium'>(3) 포장재</h3>
                {renderSaveButton(handleSavePackagingMaterials, packagingMaterialsSaved, "포장재")}
              </div>
              <div className='flex justify-end mb-4'>
                <button
                  type='button'
                  onClick={handleAddPackagingMaterial}
                  className='px-3 py-2 bg-blue-50 text-blue-700 border border-blue-300 rounded-md hover:bg-blue-100 focus:outline-none flex items-center'
                >
                  <FaPlus className='mr-2' size={14} />
                  <span>추가</span>
                </button>
              </div>
              <div className='lg:hidden'>
                <div className='mb-4'>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    포장재 목록
                  </label>
                  <select
                    className='w-full p-2 border border-gray-300 rounded-md'
                    value={selectedPackagingMaterialId || ''}
                    onChange={(e) =>
                      handleSelectPackagingMaterial(Number(e.target.value))
                    }
                  >
                    {packagingMaterials.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name || `포장재 ${m.id}`}
                      </option>
                    ))}
                  </select>
                </div>
                {selectedPackagingMaterialId && (
                  <PackagingMobileForm
                    packagingMaterial={packagingMaterials.find(
                      (m) => m.id === selectedPackagingMaterialId
                    )}
                    unitOptions={unitOptions}
                    onDelete={handleDeletePackagingMaterial}
                    onInputChange={handlePackagingInputChange}
                    defaultSuppliers={DEFAULT_SUPPLIERS}
                  />
                )}
              </div>
              <PackagingDeskTopForm
                packagingMaterials={packagingMaterials}
                selectedPackagingMaterialId={selectedPackagingMaterialId}
                unitOptions={unitOptions}
                onSelectPackagingMaterial={handleSelectPackagingMaterial}
                onInputChange={handlePackagingInputChange}
                onDeletePackagingMaterial={handleDeletePackagingMaterial}
                defaultSuppliers={DEFAULT_SUPPLIERS}
              />
            </div>
          </>
        )}
      </div>

      {/* 에너지 섹션 */}
      <EnergyTabContent siteId={siteId} />

      {/* 유틸리티 섹션 */}
      <UtilitiesTabContent siteId={siteId} />

      {/* 폐가스 섹션 */}
      <WasteGasTabContent siteId={siteId} />
    </div>
  );
};

export default PurchasesTabContent;
