// app/data/koreanStandardIndustry.ts

export interface IndustryClassification {
  id: string;
  name: string;
  code: string;
  category: '가정, 기타' | '제조업, 건설업' | '에너지 산업' | '상업, 공공';
}

export const industryClassifications: IndustryClassification[] = [
  {
    id: '1',
    name: '농업, 임업 및 어업',
    code: '01~03',
    category: '가정, 기타',
  },
  {
    id: '2',
    name: '광업',
    code: '05~08',
    category: '제조업, 건설업',
  },
  {
    id: '3',
    name: '제조업',
    code: '10~34',
    category: '제조업, 건설업',
  },
  {
    id: '4',
    name: '전력, 가스, 증기 및 공기 조절 공급업',
    code: '35',
    category: '에너지 산업',
  },
  {
    id: '5',
    name: '수도, 하수 및 폐기물 처리, 원료 재생업',
    code: '36~39',
    category: '상업, 공공',
  },
  {
    id: '6',
    name: '해체, 선별 및 원료 재생업',
    code: '383',
    category: '제조업, 건설업',
  },
  {
    id: '7',
    name: '건설업',
    code: '41~42',
    category: '제조업, 건설업',
  },
  {
    id: '8',
    name: '도매 및 소매업',
    code: '45~47',
    category: '상업, 공공',
  },
  {
    id: '9',
    name: '운수 및 창고업',
    code: '49~52',
    category: '상업, 공공',
  },
  {
    id: '10',
    name: '숙박 및 음식점업',
    code: '55~56',
    category: '상업, 공공',
  },
  {
    id: '11',
    name: '정보통신업',
    code: '58~63',
    category: '상업, 공공',
  },
  {
    id: '12',
    name: '서적, 잡지 및 기타 인쇄물 출판업',
    code: '581',
    category: '제조업, 건설업',
  },
  {
    id: '13',
    name: '오디오물 출판 및 원판 녹음업',
    code: '592',
    category: '제조업, 건설업',
  },
  // 나머지 항목들 추가
  {
    id: '14',
    name: '금융 및 보험업',
    code: '64~66',
    category: '상업, 공공',
  },
  {
    id: '15',
    name: '부동산업',
    code: '68',
    category: '상업, 공공',
  },
  // ... 나머지 항목
];

export const emissionCategories = {
  CH4: {
    categories: ['에너지 산업', '제조업 건설업', '상업 공공', '가정 기타'],
  },
  N2O: {
    categories: ['에너지 산업', '제조업 건설업', '상업 공공', '가정 기타'],
  },
};
