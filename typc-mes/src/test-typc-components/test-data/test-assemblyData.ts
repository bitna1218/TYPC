export type AssemblyOrder = {
  id: number;
  orderNum: string;
  customer: string;
  phone: string;
  product: string;
  quantity: number;
  orderDate: string;
  assemblyDate: string;
  notes: string;
  status: string;
  borderColor: string;
};

export const assemblyData: AssemblyOrder[] = [
  { 
    id: 1, 
    orderNum: '2025070141564991', 
    customer: '홍길동', 
    phone: '010-1234-5678',
    product: 'T02 7월 컴퓨터 견적 No.2 게임용 롤 피파 오버워치 로아 발로란트', 
    quantity: 1, 
    orderDate: '2025-07-01',
    assemblyDate: '2025-07-03',
    notes: 'RGB 조명 추가 요청',
    status: '조립 대기', 
    borderColor: 'border-l-green-500' 
  },
  { 
    id: 2, 
    orderNum: '2025070241564992', 
    customer: '박영희', 
    phone: '010-2345-6789',
    product: 'T05 7월 사무용 컴퓨터 No.5 오피스 엑셀 파워포인트 크롬 카카오톡', 
    quantity: 1, 
    orderDate: '2025-07-02',
    assemblyDate: '2025-07-04',
    notes: '조용한 쿨러 사용',
    status: '조립중', 
    borderColor: 'border-l-blue-500' 
  },
  { 
    id: 3, 
    orderNum: '2025070341564993', 
    customer: '김철수', 
    phone: '010-3456-7890',
    product: 'T08 7월 편집용 컴퓨터 No.8 프리미어 포토샵 애프터이펙트 다빈치', 
    quantity: 1, 
    orderDate: '2025-07-03',
    assemblyDate: '2025-07-05',
    notes: '32GB 메모리로 업그레이드',
    status: '조립 대기', 
    borderColor: 'border-l-green-500' 
  },
  { 
    id: 4, 
    orderNum: '2025070441564994', 
    customer: '이영수', 
    phone: '010-4567-8901',
    product: 'T12 7월 하이엔드 게이밍 컴퓨터 No.12 스타크래프트2 디아블로4 사이버펑크', 
    quantity: 1, 
    orderDate: '2025-07-04',
    assemblyDate: '2025-07-06',
    notes: '고성능 그래픽카드 완료',
    status: '조립 완료', 
    borderColor: 'border-l-gray-500'
  }
];
