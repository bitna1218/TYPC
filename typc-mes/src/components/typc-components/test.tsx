'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, User, ChevronDown, ChevronUp, Edit, Plus, Trash2, Camera, X, Play, Pause, Square, Clock } from 'lucide-react';

// 타입 정의
interface AssemblyOrder {
  id: number;
  orderNum: string;
  customer: string;
  phone: string;
  product: string;
  quantity: number;
  orderDate: string;
  assemblyDate: string;
  notes: string;
  status: '조립 대기' | '조립중' | '조립 완료';
  borderColor: string;
}

interface NewOrder {
  orderNum: string;
  customer: string;
  phone: string;
  product: string;
  orderDate: string;
  notes: string;
}

interface PartData {
  brand: string;
  part: string;
  checked: boolean;
}

interface CustomComponent {
  category1: string;
  category2: string;
  category3: string;
  displayName: string;
  checked: boolean;
}

interface NewComponent {
  category1: string;
  category2: string;
  category3: string;
}

interface UploadedPhoto {
  id: number;
  file: File;
  url: string;
  name: string;
}

interface PartsInventory {
  [category: string]: {
    [brand: string]: string[];
  };
}

interface CompletionData {
  orderNum: string;
  customer: string;
  totalTime: string;
  startTime: string;
  endTime: string;
}

type TimerState = 'ready' | 'running' | 'paused' | 'completed';
type ViewState = 'list' | 'assembly';

const RealtimeAssemblyView: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('list');
  const [selectedOrder, setSelectedOrder] = useState<AssemblyOrder | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showAddOrder, setShowAddOrder] = useState<boolean>(false);
  const [showPhotoModal, setShowPhotoModal] = useState<boolean>(false);
  const [showEditOrder, setShowEditOrder] = useState<boolean>(false);
  const [editingOrder, setEditingOrder] = useState<AssemblyOrder | null>(null);
  const [showAddComponent, setShowAddComponent] = useState<boolean>(false);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState<string[]>(['조립 대기', '조립중']); // 완료는 기본적으로 숨김
  const [showCompleted, setShowCompleted] = useState<boolean>(false); // 완료된 주문 표시 여부
  const itemsPerPage: number = 10;

  // 부품 재고 데이터
  const partsInventory: PartsInventory = {
    'CASE': {
      'ASUS': ['PRIME A320M-K', 'TUF Gaming A520M'],
      '1stPlayer': ['Mi5', 'White Case Pro'],
      '컬러풀': ['White Gaming Case', 'RGB Case']
    },
    'PSU': {
      '맥스엘리트': ['듀오 700W', '듀오 850W'],
      'ASUS': ['650W 80+ Gold', '750W 80+ Platinum'],
      '컬러풀': ['600W Modular', '800W RGB']
    },
    'VGA': {
      '컬러풀': ['RTX4060Ti 화이트', 'RTX4070 Super'],
      'ASUS': ['RTX4080 TUF', 'RTX4090 ROG'],
      'MSI': ['RTX4060 Gaming X', 'RTX4070Ti Gaming']
    },
    'SSD': {
      '솔리다임': ['P44 Pro 1TB', 'P44 Pro 512G'],
      '삼성': ['980 PRO 1TB', '970 EVO Plus 2TB'],
      'WD': ['Black SN850X 1TB', 'Blue 500GB']
    },
    'CPU': {
      'AMD': ['라이젠 7500F', '라이젠 5 7600X'],
      'Intel': ['i5-12400F', 'i7-13700K'],
      '인텔': ['i9-13900K', 'i3-12100F']
    },
    'M/B': {
      'ASUS': ['PRIME B650M-A II', 'TUF Gaming B550M'],
      'MSI': ['MAG B550M', 'PRO B450M'],
      'ASRock': ['B450M Steel Legend', 'X570 Phantom']
    },
    'RAM': {
      '팀그룹': ['DDR5 5600 32G(16*2)', 'DDR4 3200 16GB'],
      '삼성': ['DDR5 6000 32GB', 'DDR4 2666 8GB'],
      'G.SKILL': ['Trident Z 32GB', 'Ripjaws V 16GB']
    }
  };

  const [assemblyData, setAssemblyData] = useState<AssemblyOrder[]>([
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
  ]);

  const [newOrder, setNewOrder] = useState<NewOrder>({
    orderNum: '',
    customer: '',
    phone: '',
    product: '',
    orderDate: '',
    notes: ''
  });

  const [assemblyProgress, setAssemblyProgress] = useState<Record<string, PartData>>({
    CASE: { brand: '', part: '', checked: false },
    PSU: { brand: '', part: '', checked: false },
    VGA: { brand: '', part: '', checked: false },
    SSD: { brand: '', part: '', checked: false },
    CPU: { brand: '', part: '', checked: false },
    'M/B': { brand: '', part: '', checked: false },
    RAM: { brand: '', part: '', checked: false }
  });

  const [customComponents, setCustomComponents] = useState<Record<string, CustomComponent>>({});
  const [newComponent, setNewComponent] = useState<NewComponent>({
    category1: '',
    category2: '',
    category3: ''
  });

  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([]);

  // 파일 input ref 추가
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 타이머 상태
  const [timerState, setTimerState] = useState<TimerState>('ready');
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [pausedTime, setPausedTime] = useState<number>(0);

  // 타이머 업데이트
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerState === 'running') {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - (startTime?.getTime() || 0) - pausedTime) / 1000));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerState, startTime, pausedTime]);

  // 현재 날짜 가져오기
  const getCurrentDate = (): string => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    return `${month}/${day}`;
  };

  // 어제 날짜 가져오기
  const getYesterdayDate = (): string => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  };

  // 선택된 날짜의 주문 필터링
  const getOrdersByDate = (date: string): AssemblyOrder[] => {
    return assemblyData.filter(order => order.assemblyDate === date);
  };

  // 어제 조립 안된 주문 체크
  const getYesterdayUnfinishedOrders = (): AssemblyOrder[] => {
    const yesterday = getYesterdayDate();
    return assemblyData.filter(order => 
      order.assemblyDate === yesterday && order.status !== '조립 완료'
    );
  };

  // 캘린더 날짜 선택
  const handleDateSelect = (date: string): void => {
    setSelectedDate(date);
    setShowCalendar(false);
  };

  // 표시할 주문 목록 결정 (날짜 + 상태 필터링)
  const getDisplayOrders = (): AssemblyOrder[] => {
    let filteredOrders = assemblyData;
    const today = new Date().toISOString().split('T')[0];
    
    // 날짜 필터링
    if (selectedDate !== today) {
      filteredOrders = getOrdersByDate(selectedDate);
    } else {
      // 오늘 선택시: 오늘 주문 + 지난 날짜의 조립 대기/조립중 건들도 포함
      const todayOrders = getOrdersByDate(selectedDate);
      const overdueOrders = assemblyData.filter(order => 
        order.assemblyDate < today && (order.status === '조립 대기' || order.status === '조립중')
      );
      filteredOrders = [...todayOrders, ...overdueOrders];
    }
    
    // 상태 필터링 (완료 제외)
    filteredOrders = filteredOrders.filter(order => 
      statusFilter.includes(order.status)
    );
    
    return filteredOrders;
  };

  // 완료된 주문만 가져오기
  const getCompletedOrders = (): AssemblyOrder[] => {
    return assemblyData.filter(order => order.status === '조립 완료');
  };

  // 상태 필터 토글
  const toggleStatusFilter = (status: string): void => {
    setStatusFilter(prev => {
      const newFilter = prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status];
      return newFilter;
    });
  };

  // 캘린더 생성
  const generateCalendar = (): (number | null)[] => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const calendar: (number | null)[] = [];
    
    // 빈 칸 추가 (월 시작 전)
    for (let i = 0; i < startDayOfWeek; i++) {
      calendar.push(null);
    }
    
    // 날짜 추가
    for (let day = 1; day <= daysInMonth; day++) {
      calendar.push(day);
    }
    
    return calendar;
  };

  const startAssembly = (order: AssemblyOrder): void => {
    setSelectedOrder(order);
    setCurrentView('assembly');
    setTimerState('ready');
    setElapsedTime(0);
    setStartTime(null);
    setPausedTime(0);
    
    // 주문 상태를 '조립중'으로 변경
    setAssemblyData(prev => prev.map(item => 
      item.id === order.id 
        ? { ...item, status: '조립중', borderColor: 'border-l-blue-500' }
        : item
    ));
  };

  const completeAssembly = (completionData?: CompletionData): void => {
    if (completionData && selectedOrder) {
      // 주문을 조립 완료 상태로 변경 (제거하지 않음)
      setAssemblyData(prev => prev.map(item => 
        item.id === selectedOrder.id 
          ? { ...item, status: '조립 완료', borderColor: 'border-l-gray-500' }
          : item
      ));
    }
    // 목록 화면으로 돌아가기
    setCurrentView('list');
    setSelectedOrder(null);
    setTimerState('ready');
    setElapsedTime(0);
    setStartTime(null);
    setPausedTime(0);
  };

  const handleAddOrder = (): void => {
    if (newOrder.orderNum && newOrder.customer && newOrder.product && newOrder.phone && newOrder.orderDate) {
      const isDuplicateOrderNum = assemblyData.some(item => item.orderNum === newOrder.orderNum);
      const isDuplicateCustomerProduct = assemblyData.some(item => 
        item.customer === newOrder.customer && item.product === newOrder.product
      );

      if (isDuplicateOrderNum) {
        alert('이미 존재하는 주문번호입니다.');
        return;
      }

      if (isDuplicateCustomerProduct) {
        alert('동일한 고객의 같은 제품이 이미 등록되어 있습니다.');
        return;
      }

      const today = new Date();
      const assemblyDateString = today.toISOString().split('T')[0];

      const newId = Math.max(...assemblyData.map(item => item.id), 0) + 1;
      setAssemblyData([...assemblyData, {
        id: newId,
        ...newOrder,
        assemblyDate: assemblyDateString,
        quantity: 1,
        status: '조립 대기',
        borderColor: 'border-l-green-500'
      }]);
      setNewOrder({ orderNum: '', customer: '', phone: '', product: '', orderDate: '', notes: '' });
      setShowAddOrder(false);
    } else {
      alert('모든 필수 항목을 입력해주세요.');
    }
  };

  const deleteOrder = (id: number): void => {
    setAssemblyData(assemblyData.filter(item => item.id !== id));
  };

  const handleEditOrder = (order: AssemblyOrder): void => {
    setEditingOrder({...order});
    setShowEditOrder(true);
  };

  const handleUpdateOrder = (): void => {
    if (editingOrder && editingOrder.orderNum && editingOrder.customer && editingOrder.product && editingOrder.phone && editingOrder.orderDate) {
      setAssemblyData(prev => prev.map(item => 
        item.id === editingOrder.id ? editingOrder : item
      ));
      setShowEditOrder(false);
      setEditingOrder(null);
    } else {
      alert('모든 필수 항목을 입력해주세요.');
    }
  };

  // 시간 포맷팅
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatStartTime = (date: Date | null): string => {
    if (!date) return '';
    return date.toLocaleTimeString('ko-KR', { hour12: false });
  };

  // 타이머 제어
  const handleStart = (): void => {
    const now = new Date();
    setStartTime(now);
    setTimerState('running');
    setElapsedTime(0);
    setPausedTime(0);
  };

  const handlePause = (): void => {
    setTimerState('paused');
    setPausedTime(prev => prev + (Date.now() - (startTime?.getTime() || 0)) - (elapsedTime * 1000));
  };

  const handleResume = (): void => {
    setTimerState('running');
  };

  const handleComplete = (): void => {
    setTimerState('completed');
    
    if (!selectedOrder) return;
    
    const completionData: CompletionData = {
      orderNum: selectedOrder.orderNum,
      customer: selectedOrder.customer,
      totalTime: formatTime(elapsedTime),
      startTime: formatStartTime(startTime),
      endTime: formatStartTime(new Date())
    };
    
    alert(`🎉 조립이 완료되었습니다!\n\n주문번호: ${completionData.orderNum}\n고객명: ${completionData.customer}\n총 소요 시간: ${completionData.totalTime}\n\n주문 목록으로 돌아갑니다.`);
    
    completeAssembly(completionData);
  };

  // 부품 체크
  const handleCheck = (component: string, checked: boolean): void => {
    if (assemblyProgress[component]) {
      setAssemblyProgress(prev => ({
        ...prev,
        [component]: { ...prev[component], checked }
      }));
    } else {
      setCustomComponents(prev => ({
        ...prev,
        [component]: { ...prev[component], checked }
      }));
    }
  };

  // 브랜드 변경
  const handleBrandChange = (component: string, brand: string): void => {
    if (assemblyProgress[component]) {
      setAssemblyProgress(prev => ({
        ...prev,
        [component]: {
          ...prev[component],
          brand,
          part: '',
          checked: false
        }
      }));
    } else {
      setCustomComponents(prev => ({
        ...prev,
        [component]: {
          ...prev[component],
          brand,
          part: '',
          checked: false
        }
      }));
    }
  };

  // 부품 변경
  const handlePartChange = (component: string, part: string): void => {
    if (assemblyProgress[component]) {
      setAssemblyProgress(prev => ({
        ...prev,
        [component]: {
          ...prev[component],
          part,
          checked: false
        }
      }));
    } else {
      setCustomComponents(prev => ({
        ...prev,
        [component]: {
          ...prev[component],
          part,
          checked: false
        }
      }));
    }
  };

  // 부품 추가
  const handleAddComponent = (): void => {
    if (newComponent.category1 && newComponent.category2 && newComponent.category3) {
      const componentKey = `${newComponent.category1}_${newComponent.category2}_${Date.now()}`;
      
      setCustomComponents(prev => ({
        ...prev,
        [componentKey]: {
          category1: newComponent.category1,
          category2: newComponent.category2,
          category3: newComponent.category3,
          displayName: newComponent.category3, // 카테고리3을 표시 이름으로 사용
          checked: false
        }
      }));
      setNewComponent({ category1: '', category2: '', category3: '' });
      setShowAddComponent(false);
    } else {
      alert('모든 카테고리를 선택해주세요.');
    }
  };

  // 부품 제거
  const handleRemoveComponent = (componentKey: string): void => {
    if (assemblyProgress[componentKey]) {
      alert('기본 부품은 제거할 수 없습니다.');
      return;
    }
    if (window.confirm('이 부품을 제거하시겠습니까?')) {
      setCustomComponents(prev => {
        const newComponents = { ...prev };
        delete newComponents[componentKey];
        return newComponents;
      });
    }
  };

  // 진행률 계산
  const getProgress = (): number => {
    const allComponents = { ...assemblyProgress, ...customComponents };
    const totalComponents = Object.keys(allComponents).length;
    const checkedComponents = Object.values(allComponents).filter(item => item.checked).length;
    return Math.round((checkedComponents / totalComponents) * 100);
  };

  // 모든 부품 완료 체크
  const isAllCompleted = (): boolean => {
    const allComponents = { ...assemblyProgress, ...customComponents };
    return Object.values(allComponents).every(item => item.checked);
  };

  // 사진 업로드
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const files = Array.from(event.target.files || []);
    const maxPhotos = 4;
    
    if (uploadedPhotos.length + files.length > maxPhotos) {
      alert(`최대 ${maxPhotos}장까지 업로드 가능합니다.`);
      return;
    }

    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newPhoto: UploadedPhoto = {
            id: Date.now() + Math.random(),
            file: file,
            url: e.target?.result as string,
            name: file.name
          };
          setUploadedPhotos(prev => [...prev, newPhoto]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removePhoto = (photoId: number): void => {
    setUploadedPhotos(prev => prev.filter(photo => photo.id !== photoId));
  };

  // 조립 화면
  if (currentView === 'assembly') {
    return (
      <div className="min-h-screen bg-gray-50 max-w-md mx-auto">
        <div className="bg-green-600 text-white p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button onClick={() => completeAssembly()}>
                <ChevronLeft size={20} />
              </button>
              <h1 className="text-base font-semibold">조립 진행</h1>
            </div>
            <div className="flex items-center gap-2">
              <User size={16} />
              <span className="text-sm font-medium">김주현</span>
              <ChevronDown size={12} />
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowCalendar(true);
                }}
                className="text-xs bg-green-700 px-3 py-2 rounded hover:bg-green-800 cursor-pointer"
                type="button"
              >
                {selectedDate === new Date().toISOString().split('T')[0] ? getCurrentDate() : 
                 new Date(selectedDate).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' })}
              </button>
            </div>
          </div>
        </div>

        <div className="p-3">
          {selectedDate !== new Date().toISOString().split('T')[0] && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
              <h3 className="text-sm font-semibold text-blue-800">
                {new Date(selectedDate).toLocaleDateString('ko-KR', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })} 조립 주문
              </h3>
              <p className="text-xs text-blue-600">
                {getDisplayOrders().length}건의 주문이 있습니다.
              </p>
            </div>
          )}
          {/* 주문 정보 */}
          <div className="bg-white rounded-lg p-4 mb-3">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xl font-bold text-blue-600">{selectedOrder?.orderNum}</span>
              <span className="text-xl font-bold text-gray-900">{selectedOrder?.customer}</span>
            </div>
            <p className="text-lg font-medium text-gray-800 leading-relaxed">
              {selectedOrder?.product}
            </p>
          </div>

          {/* 타이머 섹션 */}
          <div className={`rounded-lg p-4 mb-3 ${
            timerState === 'ready' ? 'bg-green-50 border border-green-200' :
            timerState === 'running' ? 'bg-blue-50 border border-blue-200' :
            timerState === 'paused' ? 'bg-orange-50 border border-orange-200' :
            'bg-purple-50 border border-purple-200'
          }`}>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock size={16} className={
                  timerState === 'ready' ? 'text-green-600' :
                  timerState === 'running' ? 'text-blue-600' :
                  timerState === 'paused' ? 'text-orange-600' :
                  'text-purple-600'
                } />
                <h3 className={`text-sm font-semibold ${
                  timerState === 'ready' ? 'text-green-800' :
                  timerState === 'running' ? 'text-blue-800' :
                  timerState === 'paused' ? 'text-orange-800' :
                  'text-purple-800'
                }`}>
                  {timerState === 'ready' ? '조립 시간 측정' :
                   timerState === 'running' ? '조립 진행 중...' :
                   timerState === 'paused' ? '조립 일시정지' :
                   '조립 완료'}
                </h3>
              </div>

              {timerState === 'ready' ? (
                <button
                  onClick={handleStart}
                  className="flex items-center gap-3 px-8 py-5 bg-green-600 text-white rounded-xl font-semibold text-lg hover:bg-green-700 mx-auto shadow-lg"
                >
                  <Play size={24} />
                  조립 시작하기
                </button>
              ) : (
                <div>
                  <div className={`text-3xl font-mono font-bold mb-2 ${
                    timerState === 'running' ? 'text-blue-600' :
                    timerState === 'paused' ? 'text-orange-600' :
                    'text-purple-600'
                  }`}>
                    {formatTime(elapsedTime)}
                    {timerState === 'paused' && <span className="text-sm ml-2">(정지됨)</span>}
                  </div>
                  
                  {startTime && (
                    <p className="text-xs text-gray-600 mb-3">
                      시작: {formatStartTime(startTime)}
                    </p>
                  )}

                  <div className="flex items-center justify-center gap-3">
                    {timerState === 'running' && (
                      <>
                        <button
                          onClick={handlePause}
                          className="flex items-center gap-2 px-5 py-3 bg-orange-500 text-white rounded-lg text-base font-medium hover:bg-orange-600"
                        >
                          <Pause size={18} />
                          일시정지
                        </button>
                        <button
                          onClick={handleComplete}
                          disabled={!isAllCompleted()}
                          className={`flex items-center gap-2 px-5 py-3 rounded-lg text-base font-medium ${
                            isAllCompleted() 
                              ? 'bg-blue-600 text-white hover:bg-blue-700' 
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          <Square size={18} />
                          조립완료
                        </button>
                      </>
                    )}
                    
                    {timerState === 'paused' && (
                      <>
                        <button
                          onClick={handleResume}
                          className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-lg text-base font-medium hover:bg-blue-700"
                        >
                          <Play size={18} />
                          재개하기
                        </button>
                        <button
                          onClick={handleComplete}
                          disabled={!isAllCompleted()}
                          className={`flex items-center gap-2 px-5 py-3 rounded-lg text-base font-medium ${
                            isAllCompleted() 
                              ? 'bg-blue-600 text-white hover:bg-blue-700' 
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          <Square size={18} />
                          조립완료
                        </button>
                      </>
                    )}
                  </div>

                  {timerState === 'paused' && (
                    <p className="text-xs text-orange-600 mt-2">💡 휴식 시간은 측정에서 제외됩니다</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 진행률 표시 */}
          {timerState !== 'ready' && (
            <div className="bg-white rounded-lg p-3 mb-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900">조립 진행률</h3>
                <span className="text-xs text-blue-600 font-medium">{getProgress()}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgress()}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* 부품 관리 버튼 */}
          <div className="mb-4">
            <button
              onClick={() => setShowAddComponent(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg text-base font-medium hover:bg-green-700"
            >
              <Plus size={18} />
              부품 추가
            </button>
          </div>

          {/* 부품 선택 */}
          <div className="space-y-2">
            {/* 기본 부품들 */}
            {Object.entries(assemblyProgress).map(([component, data]) => (
              <div key={component} className={`bg-white rounded-lg border-l-4 p-3 ${
                data.checked ? 'border-l-green-500 bg-green-50' : 'border-l-gray-300'
              } ${timerState === 'ready' ? 'opacity-50' : ''}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-gray-900">{component}</h4>
                    {data.checked && <span className="text-xs text-green-600 font-medium">✓ 완료</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Edit size={14} className={timerState === 'ready' ? 'text-gray-400' : 'text-blue-600'} />
                    <input
                      type="checkbox"
                      checked={data.checked}
                      onChange={(e) => handleCheck(component, e.target.checked)}
                      disabled={timerState === 'ready' || !data.part}
                      className="w-4 h-4"
                    />
                  </div>
                </div>

                {/* 2단계 선택 (조립 시작 후에만 표시) */}
                {timerState !== 'ready' && (
                  <div className="space-y-2">
                    {/* 1단계: 브랜드 선택 */}
                    <select
                      value={data.brand}
                      onChange={(e) => handleBrandChange(component, e.target.value)}
                      className="w-full px-2 py-2 border border-gray-300 rounded-md text-xs focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">브랜드 선택</option>
                      {partsInventory[component] && Object.keys(partsInventory[component]).map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </select>

                    {/* 2단계: 부품 선택 */}
                    <select
                      value={data.part}
                      onChange={(e) => handlePartChange(component, e.target.value)}
                      disabled={!data.brand}
                      className="w-full px-2 py-2 border border-gray-300 rounded-md text-xs focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    >
                      <option value="">부품 선택</option>
                      {data.brand && partsInventory[component] && partsInventory[component][data.brand] && 
                        partsInventory[component][data.brand].map(part => (
                          <option key={part} value={part}>{part}</option>
                        ))
                      }
                    </select>
                  </div>
                )}
              </div>
            ))}

            {/* 추가된 부품들 */}
            {Object.entries(customComponents).map(([componentKey, data]) => (
              <div key={componentKey} className={`bg-white rounded-lg border-l-4 p-3 ${
                data.checked ? 'border-l-green-500 bg-green-50' : 'border-l-orange-300'
              } ${timerState === 'ready' ? 'opacity-50' : ''}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-gray-900">{data.displayName}</h4>
                    <span className="text-xs text-orange-600 bg-orange-100 px-1 rounded">{data.category1}</span>
                    {data.checked && <span className="text-xs text-green-600 font-medium">✓ 완료</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRemoveComponent(componentKey)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={14} />
                    </button>
                    <input
                      type="checkbox"
                      checked={data.checked}
                      onChange={(e) => handleCheck(componentKey, e.target.checked)}
                      disabled={timerState === 'ready'}
                      className="w-4 h-4"
                    />
                  </div>
                </div>

                {/* 커스텀 부품은 선택한 정보 표시 */}
                {timerState !== 'ready' && (
                  <div className="text-xs text-gray-500">
                    {data.category1} → {data.category2} → {data.category3}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 사진 업로드 섹션 */}
          <div className="bg-white rounded-lg p-4 mt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900">조립 사진</h3>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-medium hover:bg-blue-700"
                >
                  <Camera size={18} />
                  사진 추가
                </button>
              </div>
            </div>
            
            {uploadedPhotos.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {uploadedPhotos.map(photo => (
                  <div key={photo.id} className="relative">
                    <img 
                      src={photo.url} 
                      alt={photo.name}
                      className="w-full h-20 object-cover rounded border"
                    />
                    <button
                      onClick={() => removePhoto(photo.id)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 text-center py-4">업로드된 사진이 없습니다</p>
            )}
          </div>
        </div>

        {/* 부품 추가 모달 */}
        {showAddComponent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 m-4 w-full max-w-sm">
              <h3 className="text-lg font-semibold mb-3">부품 추가</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">카테고리 1</label>
                  <select
                    value={newComponent.category1}
                    onChange={(e) => setNewComponent(prev => ({ 
                      ...prev, 
                      category1: e.target.value, 
                      category2: '', 
                      category3: ''
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">카테고리 1 선택</option>
                    {Object.keys(partsInventory).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">카테고리 2 (브랜드)</label>
                  <select
                    value={newComponent.category2}
                    onChange={(e) => setNewComponent(prev => ({ 
                      ...prev, 
                      category2: e.target.value, 
                      category3: ''
                    }))}
                    disabled={!newComponent.category1}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  >
                    <option value="">브랜드 선택</option>
                    {newComponent.category1 && partsInventory[newComponent.category1] && 
                      Object.keys(partsInventory[newComponent.category1]).map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))
                    }
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">카테고리 3 (세부 부품)</label>
                  <select
                    value={newComponent.category3}
                    onChange={(e) => setNewComponent(prev => ({ 
                      ...prev, 
                      category3: e.target.value
                    }))}
                    disabled={!newComponent.category2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  >
                    <option value="">세부 부품 선택</option>
                    {newComponent.category2 && partsInventory[newComponent.category1] && 
                      partsInventory[newComponent.category1][newComponent.category2] &&
                      partsInventory[newComponent.category1][newComponent.category2].map(part => (
                        <option key={part} value={part}>{part}</option>
                      ))
                    }
                  </select>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleAddComponent}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                  추가
                </button>
                <button
                  onClick={() => setShowAddComponent(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto">
      {/* 메인 목록 화면 */}
      <div className="bg-green-600 text-white p-3">
        <div className="flex items-center justify-between">
          <h1 className="text-base font-semibold">실시간 조립 관리</h1>
          <div className="flex items-center gap-2">
            <User size={16} />
            <span className="text-sm font-medium">김주현</span>
            <ChevronDown size={12} />
            <button 
              onClick={() => setShowCalendar(true)}
              className="text-sm bg-green-700 px-3 py-2 rounded hover:bg-green-800 cursor-pointer"
            >
              {selectedDate === new Date().toISOString().split('T')[0] ? getCurrentDate() : 
               (() => {
                 const date = new Date(selectedDate);
                 const month = date.getMonth() + 1;
                 const day = date.getDate();
                 return `${month}/${day}`;
               })()}
            </button>
          </div>
        </div>
      </div>

      <div className="p-3">
        {/* 상태 필터 - 3개 버튼 */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {(['조립 대기', '조립중', '조립 완료'] as const).map(status => {
            const isActive = status === '조립 완료' ? showCompleted : statusFilter.includes(status);
            const today = new Date().toISOString().split('T')[0];
            
            // 총 개수 계산
            let statusCount = 0;
            if (status === '조립 대기') {
              const todayCount = assemblyData.filter(order => 
                order.status === status && order.assemblyDate === today
              ).length;
              const overdueCount = assemblyData.filter(order => 
                order.status === status && order.assemblyDate < today
              ).length;
              statusCount = todayCount + overdueCount;
            } else if (status === '조립중') {
              const todayCount = assemblyData.filter(order => 
                order.status === status && order.assemblyDate === today
              ).length;
              const overdueCount = assemblyData.filter(order => 
                order.status === status && order.assemblyDate < today
              ).length;
              statusCount = todayCount + overdueCount;
            } else {
              statusCount = assemblyData.filter(order => order.status === status).length;
            }
            
            return (
              <button
                key={status}
                onClick={() => {
                  if (status === '조립 완료') {
                    setShowCompleted(!showCompleted);
                  } else {
                    toggleStatusFilter(status);
                  }
                }}
                className={`p-4 rounded-lg text-center transition-colors ${
                  isActive 
                    ? status === '조립 대기' ? 'bg-green-100 text-green-800 border-2 border-green-300' :
                      status === '조립중' ? 'bg-blue-100 text-blue-800 border-2 border-blue-300' :
                      'bg-gray-100 text-gray-800 border-2 border-gray-300'
                    : 'bg-gray-50 text-gray-500 border-2 border-transparent hover:bg-gray-100'
                }`}
              >
                <div className={`w-8 h-8 rounded mx-auto mb-3 ${
                  status === '조립 대기' ? 'bg-green-500' :
                  status === '조립중' ? 'bg-blue-500' :
                  'bg-gray-500'
                }`}></div>
                <div className="text-sm font-medium mb-2">{status}</div>
                <div className={`text-2xl font-bold ${
                  isActive 
                    ? status === '조립 대기' ? 'text-green-800' :
                      status === '조립중' ? 'text-blue-800' :
                      'text-gray-800'
                    : 'text-gray-600'
                }`}>
                  {statusCount}
                </div>
              </button>
            );
          })}
        </div>
        
        <button
          onClick={() => setShowAddOrder(true)}
          className="w-full bg-green-600 text-white py-3 rounded-lg mb-3 flex items-center justify-center gap-2 hover:bg-green-700"
        >
          <Plus size={16} />
          주문 추가
        </button>

        {/* 주문 목록 - 조립 대기, 조립중만 표시 */}
        <div className="space-y-4">
          {getDisplayOrders().length > 0 ? (
            getDisplayOrders().map(order => (
              <div 
                key={order.id} 
                className={`bg-white rounded-lg border-l-4 ${order.borderColor} p-4 cursor-pointer hover:shadow-md transition-shadow relative`}
                onClick={() => startAssembly(order)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-lg font-bold text-blue-600 truncate">{order.orderNum}</span>
                    <span className="text-lg font-semibold text-gray-900">{order.customer}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleEditOrder(order)}
                      className="text-blue-600 hover:text-blue-800 p-2"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => deleteOrder(order.id)}
                      className="text-red-600 hover:text-red-800 p-2"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <p className="text-base text-gray-700 line-clamp-2 leading-relaxed font-medium">
                  {order.product}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-base text-gray-500 mb-4">
                {statusFilter.length === 0 
                  ? '표시할 상태가 선택되지 않았습니다' 
                  : selectedDate === new Date().toISOString().split('T')[0] 
                    ? `${statusFilter.join(', ')} 상태의 주문이 없습니다`
                    : `해당 날짜에 ${statusFilter.join(', ')} 상태의 주문이 없습니다`}
              </p>
              {selectedDate === new Date().toISOString().split('T')[0] && statusFilter.length > 0 && (
                <button
                  onClick={() => setShowAddOrder(true)}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 text-base"
                >
                  주문 추가하기
                </button>
              )}
            </div>
          )}
        </div>

        {/* 완료된 주문 목록 - 조립 완료 버튼 클릭 시에만 표시 */}
        {showCompleted && (
          <div className="mt-6">
            <div className="space-y-3">
              {getCompletedOrders().length > 0 ? (
                getCompletedOrders().map(order => (
                  <div 
                    key={order.id} 
                    className="bg-white rounded-lg border-l-4 border-l-gray-500 p-4 opacity-75"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-lg font-bold text-blue-600 truncate">{order.orderNum}</span>
                        <span className="text-lg font-semibold text-gray-900">{order.customer}</span>
                        <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium flex-shrink-0">
                          ✓ 완료
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-base text-gray-700 line-clamp-2 leading-relaxed font-medium">
                      {order.product}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-base text-gray-500">완료된 주문이 없습니다</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 상태 범례 - 하단에 위치 */}
        <div className="bg-white rounded-lg p-3 mt-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">상태 범례</h3>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-xs text-gray-600">조립 대기</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-xs text-gray-600">조립중</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-500 rounded"></div>
              <span className="text-xs text-gray-600">조립 완료</span>
            </div>
          </div>
        </div>
      </div>

      {/* 캘린더 모달 */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 m-4 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">날짜 선택</h3>
              <button
                onClick={() => setShowCalendar(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-4">
              <div className="text-center text-sm font-medium text-gray-700 mb-2">
                {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}
              </div>
              
              <div className="grid grid-cols-7 gap-1 text-xs text-center mb-2">
                {['일', '월', '화', '수', '목', '금', '토'].map(day => (
                  <div key={day} className="p-2 font-medium text-gray-600">{day}</div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {generateCalendar().map((day, index) => {
                  if (day === null) return <div key={index} className="p-2"></div>;
                  
                  const date = new Date();
                  date.setDate(day);
                  const dateString = date.toISOString().split('T')[0];
                  const isToday = dateString === new Date().toISOString().split('T')[0];
                  const isSelected = dateString === selectedDate;
                  const hasOrders = getOrdersByDate(dateString).length > 0;
                  
                  return (
                    <button
                      key={day}
                      onClick={() => handleDateSelect(dateString)}
                      className={`p-2 text-sm rounded transition-colors ${
                        isSelected 
                          ? 'bg-green-600 text-white' 
                          : isToday 
                            ? 'bg-green-100 text-green-800 font-medium'
                            : hasOrders
                              ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                              : 'hover:bg-gray-100'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div className="text-xs text-gray-500 text-center">
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-600 rounded"></div>
                  <span>선택된 날짜</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-100 rounded"></div>
                  <span>오늘</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 주문 추가 모달 */}
      {showAddOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 m-4 w-full max-w-sm max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-3">주문 추가</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">주문번호 *</label>
                <input
                  type="text"
                  value={newOrder.orderNum}
                  onChange={(e) => setNewOrder(prev => ({ ...prev, orderNum: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="주문번호를 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">고객명 *</label>
                <input
                  type="text"
                  value={newOrder.customer}
                  onChange={(e) => setNewOrder(prev => ({ ...prev, customer: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="고객명을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">전화번호 *</label>
                <input
                  type="text"
                  value={newOrder.phone}
                  onChange={(e) => setNewOrder(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="010-0000-0000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">제품명 *</label>
                <textarea
                  value={newOrder.product}
                  onChange={(e) => setNewOrder(prev => ({ ...prev, product: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="제품 설명을 입력하세요"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">주문일 *</label>
                <input
                  type="date"
                  value={newOrder.orderDate}
                  onChange={(e) => setNewOrder(prev => ({ ...prev, orderDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">특이사항</label>
                <textarea
                  value={newOrder.notes}
                  onChange={(e) => setNewOrder(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="특별한 요청사항이 있으면 입력하세요"
                  rows={2}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleAddOrder}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
              >
                추가
              </button>
              <button
                onClick={() => setShowAddOrder(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 주문 수정 모달 */}
      {showEditOrder && editingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 m-4 w-full max-w-sm max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-3">주문 수정</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">주문번호 *</label>
                <input
                  type="text"
                  value={editingOrder.orderNum}
                  onChange={(e) => setEditingOrder(prev => prev ? ({ ...prev, orderNum: e.target.value }) : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">고객명 *</label>
                <input
                  type="text"
                  value={editingOrder.customer}
                  onChange={(e) => setEditingOrder(prev => prev ? ({ ...prev, customer: e.target.value }) : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">전화번호 *</label>
                <input
                  type="text"
                  value={editingOrder.phone}
                  onChange={(e) => setEditingOrder(prev => prev ? ({ ...prev, phone: e.target.value }) : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">제품명 *</label>
                <textarea
                  value={editingOrder.product}
                  onChange={(e) => setEditingOrder(prev => prev ? ({ ...prev, product: e.target.value }) : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">주문일 *</label>
                <input
                  type="date"
                  value={editingOrder.orderDate}
                  onChange={(e) => setEditingOrder(prev => prev ? ({ ...prev, orderDate: e.target.value }) : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">특이사항</label>
                <textarea
                  value={editingOrder.notes}
                  onChange={(e) => setEditingOrder(prev => prev ? ({ ...prev, notes: e.target.value }) : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleUpdateOrder}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                수정
              </button>
              <button
                onClick={() => setShowEditOrder(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealtimeAssemblyView;