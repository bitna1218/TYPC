'use client';

import React, { useState, useEffect, useRef } from 'react';
import { EditOrderModal } from './Modal/EditOrderModal';
import { AddOrderModal } from './Modal/AddOrderModal';
import { CalendarModal } from './Modal/CalendarModal';
import { AddComponentModal } from './Modal/AddComponentModal';

import { StatusLegend } from './List/StatusLegend';
import { CompletedOrdersSection } from './List/CompletedOrdersSection';
import { OrderListSection } from './List/OrderListSection';
import { StatusFilterButtons } from './List/StatusFilterButtons';
import MainHeader from './List/MainHeader';
import PhotoUploadSection from './Assembly/PhotoUploadSection';
import AssemblyProgressSection from './Assembly/AssemblyProgressSection';
import AssemblyTimerSection from './Assembly/AssemblyTimerSection';
import ManagementHeader from './Assembly/ManagementHeader';
import SelectedDateBanner from './Assembly/SelectedDateBanner';
import SelectedOrderSummary from './Assembly/SelectedOrderSummary';
import AssemblyProgressBar from './Assembly/AssemblyProgressBar';



import { ChevronLeft, User, ChevronDown, Edit, Plus, Trash2, Camera, X, Play, Pause, Square, Clock } from 'lucide-react';
import type { AssemblyOrder, NewOrder, PartData, CustomComponent, NewComponent, UploadedPhoto, PartsInventory, CompletionData, TimerState, ViewState } from '../../types/typc-types/types';


const RealtimeAssemblyView: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('list');
  const [selectedOrder, setSelectedOrder] = useState<AssemblyOrder | null>(null);
  const [showAddOrder, setShowAddOrder] = useState<boolean>(false);
  const [showEditOrder, setShowEditOrder] = useState<boolean>(false);
  const [editingOrder, setEditingOrder] = useState<AssemblyOrder | null>(null);
  const [showAddComponent, setShowAddComponent] = useState<boolean>(false);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState<string[]>(['조립 대기', '조립중']); // 완료는 기본적으로 숨김
  const [showCompleted, setShowCompleted] = useState<boolean>(false); // 완료된 주문 표시 여부

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
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
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




  /////////////// 조립 화면 ///////////////
  if (currentView === 'assembly') {
    return (
      <div className="min-h-screen bg-gray-50 max-w-md mx-auto">
        <ManagementHeader
          completeAssembly={completeAssembly}
          setShowCalendar={setShowCalendar}
          selectedDate={selectedDate}
          getCurrentDate={getCurrentDate}
          username="김주현"
        />

        <div className="p-3">
          {selectedDate !== new Date().toISOString().split('T')[0] && (
              <SelectedDateBanner 
              selectedDate={selectedDate} 
              orderCount={getDisplayOrders().length} 
              />
          )}
          {/* 주문 정보 */}
          <SelectedOrderSummary selectedOrder={selectedOrder} />

          {/* 타이머 섹션 */}
          <AssemblyTimerSection
            timerState={timerState}
            elapsedTime={elapsedTime}
            startTime={startTime}
            handleStart={handleStart}
            handlePause={handlePause}
            handleResume={handleResume}
            handleComplete={handleComplete}
            isAllCompleted={isAllCompleted}
          />

          {/* 진행률 표시 */}
          {timerState !== 'ready' && (
            <AssemblyProgressBar progress={getProgress()} />
          )}

          {/* 부품 관리 버튼 */}
          <div className="mb-4">
            <button
              onClick={() => setShowAddComponent(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg text-base font-medium hover:bg-green-700"
            >
              <Plus size={18} />부품 추가
            </button>
          </div>

          {/* 부품 선택 */}
          <AssemblyProgressSection
            timerState={timerState}
            assemblyProgress={assemblyProgress}
            customComponents={customComponents}
            partsInventory={partsInventory}
            handleCheck={handleCheck}
            handleBrandChange={handleBrandChange}
            handlePartChange={handlePartChange}
            handleRemoveComponent={handleRemoveComponent}
          />

          {/* 사진 업로드 섹션 */}

          <PhotoUploadSection
            fileInputRef={fileInputRef}
            handlePhotoUpload={handlePhotoUpload}
            uploadedPhotos={uploadedPhotos}
            removePhoto={removePhoto}
          />
        </div>

        {/* 부품 추가 모달 */}
        {showAddComponent && (
          <AddComponentModal
            showAddComponent={showAddComponent}
            setShowAddComponent={setShowAddComponent}
            partsInventory={partsInventory}
            newComponent={newComponent}
            setNewComponent={setNewComponent}
            handleAddComponent={handleAddComponent}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto">
      <MainHeader
        selectedDate={selectedDate}
        setShowCalendar={setShowCalendar}
        getCurrentDate={getCurrentDate}
      />

      <div className="p-3">
        {/* 상태 필터 - 3개 버튼 */}
        <StatusFilterButtons
          assemblyData={assemblyData}
          showCompleted={showCompleted}
          setShowCompleted={setShowCompleted}
          statusFilter={statusFilter}
          toggleStatusFilter={toggleStatusFilter}
        />
        
        <button
          onClick={() => setShowAddOrder(true)}
          className="w-full bg-green-600 text-white py-3 rounded-lg mb-3 flex items-center justify-center gap-2 hover:bg-green-700"
        >
          <Plus size={16} />주문 추가
        </button>

        {/* 주문 목록 - 조립 대기, 조립중만 표시 */}
        <OrderListSection
          getDisplayOrders={getDisplayOrders}
          startAssembly={startAssembly}
          handleEditOrder={handleEditOrder}
          deleteOrder={deleteOrder}
          statusFilter={statusFilter}
          selectedDate={selectedDate}
          setShowAddOrder={setShowAddOrder}
        />

        {/* 완료된 주문 목록 - 조립 완료 버튼 클릭 시에만 표시 */}
        {showCompleted && (
          <CompletedOrdersSection getCompletedOrders={getCompletedOrders} />
        )}

        {/* 상태 범례 - 하단에 위치 */}
        <StatusLegend />
        
      </div>

      {/* 캘린더 모달 */}
      {showCalendar && (
        <CalendarModal
          showCalendar={showCalendar}
          setShowCalendar={setShowCalendar}
          selectedDate={selectedDate}
          handleDateSelect={handleDateSelect}
          generateCalendar={generateCalendar}
          getOrdersByDate={getOrdersByDate}
        />
      )}

      {/* 주문 추가 모달 */}
      {showAddOrder && (
        <AddOrderModal
          showAddOrder={showAddOrder}
          setShowAddOrder={setShowAddOrder}
          newOrder={newOrder}
          setNewOrder={setNewOrder}
          handleAddOrder={handleAddOrder}
        />
      )}

      {/* 주문 수정 모달 */}
      <EditOrderModal
        editingOrder={editingOrder}
        setEditingOrder={setEditingOrder}
        handleUpdateOrder={handleUpdateOrder}
        setShowEditOrder={setShowEditOrder}
      />
    </div>
  );
};

export default RealtimeAssemblyView;