'use client';

import React, { useState } from 'react';
import MainHeader from './test-components/List/test-MainHeader';
import StatusFilterButtons from './test-components/List/test-StatusFilterButtonsProps';
import AddOrderButton from './test-components/List/test-AddOrderButton';
import OrderListSection from './test-components/List/test-OrderListSection';
import StatusLegend from './test-components/List/test-StatusLegend';

import ManagementHeader from './test-components/Assembly/test-ManagementHeader';
import SelectedOrderSummary from './test-components/Assembly/test-SelectedOrderSummary';
import AssemblyTimerSection from './test-components/Assembly/test-AssemblyTimerSection';
import AssemblyProgressBar from './test-components/Assembly/test-AssemblyProgressBar';
import AssemblyButton from './test-components/Assembly/test-AssemblyButton';
import AssemblyProgressSection from './test-components/Assembly/test-AssemblyProgressSection';
import PhotoUploadSection from './test-components/Assembly/test-PhotoUploadSection';

import CalendarModal from './test-components/Modal/test-CalendarModal';
import AddOrderModal from './test-components/Modal/test-AddOrderModal';
import EditOrderModal from './test-components/Modal/test-EditOrderModal';
import AddComponentModal from './test-components/Modal/test-AddComponentModal';

import { assemblyData as initialAssemblyData, AssemblyOrder }from '../test-typc-components/test-data/test-assemblyData';


const RealtimeAssemblyView: React.FC = () => {
    
    const [showCalendar, setShowCalendar] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddComponentModal, setShowAddComponentModal] = useState(false);

    const [currentView, setCurrentView] = useState('list');
    const [timerState, setTimerState] = useState<'ready' | 'running' | 'paused' | 'completed'>('ready');

    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [assemblyData, setAssemblyData] = useState<AssemblyOrder[]>(initialAssemblyData); // 전체 주문 목록
    const [editOrder, setEditOrder] = useState<AssemblyOrder | null>(null); // 수정할 주문 저장
    const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

    const [selectedOrder, setSelectedOrder] = useState<AssemblyOrder | null>(null);

    //edit 버튼 클릭 시 실행되는 함수
    const handleOpenEditOrderModal = (order: AssemblyOrder) => {
        setEditOrder(order);       
        setShowEditModal(true);      
    };

    //수정 완료 후 저장할 때
    const handleUpdateOrder = (updatedOrder: AssemblyOrder) => {
        setAssemblyData(prev =>
            prev.map(order =>
            order.id === updatedOrder.id ? updatedOrder : order
            )
        );
        setShowEditModal(false);   
        setEditOrder(null);     
    };

    //order list 삭제
    const handleDeleteOrder = (id: string) => {
        setAssemblyData(prev => prev.filter(order => order.id !== Number(id)));
    };

    //조립 시작 버튼 클릭
    const handleStart = () => {
        setTimerState('running');
    }

    //조립 일시정지 버튼 클릭
    const handlePause = () => {
        setTimerState('paused');
    }

    //조립 재개 버튼 클릭
    const handleResume = () => {
        setTimerState('running');
    }

    //조립 완료 버튼 클릭
    const handleComplete = () => {
        alert(`🎉 조립이 완료되었습니다!\n\n주문번호: \n고객명: \n총 소요 시간: \n\n주문 목록으로 돌아갑니다.`);
        setCurrentView('list')
    }


    if (currentView === 'assembly') {
        //조립화면
        return (
            <div className="min-h-screen bg-gray-50 max-w-md mx-auto">
                
                <ManagementHeader 
                backToList={() => setCurrentView('list')} 
                username="김주현" 
                selectedDate={selectedDate}
                />

                <div className="p-3">
                    <SelectedOrderSummary order={selectedOrder}/>
                    
                    <AssemblyTimerSection 
                    timerState={timerState} 
                    handleStart={handleStart}
                    handlePause={handlePause}
                    handleResume={handleResume}
                    handleComplete={handleComplete}
                    />

                    {timerState !== 'ready' && 
                    <AssemblyProgressBar />
                    }

                    <AssemblyButton onOpenAddComponentModal={() => setShowAddComponentModal(true)}/>
                    <AssemblyProgressSection timerState={timerState} />
                    <PhotoUploadSection />
                </div>

                {/* 부품추가 모달 */}
                {showAddComponentModal && (
                    <AddComponentModal
                    onClose={() => setShowAddComponentModal(false)}
                    />
                )}
            </div>

        );

    }else{

        //리스트 화면
        return (
            
            <div className="min-h-screen bg-gray-50 max-w-md mx-auto">
                <MainHeader 
                onOpenCalendar={() => setShowCalendar(true)}
                selectedDate={selectedDate}
                />

                <div className="p-3">
                    {/* 상태 필터 - 3개 버튼 */}
                    <StatusFilterButtons 
                    assemblyData={assemblyData}
                    selectedStatus={selectedStatus}
                    setSelectedStatus={setSelectedStatus}
                    />

                    {/* 주문 추가 버튼 */}
                    <AddOrderButton 
                    onOpenAddOrderModal={() => setShowAddModal(true)}
                    />

                    {/* 주문 목록 */}
                    <OrderListSection 
                    assemblyData={assemblyData}
                    selectedStatus={selectedStatus}
                    onOpenEditOrderModal={handleOpenEditOrderModal}
                    onDeleteOrder={handleDeleteOrder}
                    setCurrentView={setCurrentView}
                    setSelectedOrder={setSelectedOrder}
                    />

                    {/* 상태 범례 - 하단에 위치 */}
                    <StatusLegend />
                </div>

                {/* 캘린더 모달 */}
                {showCalendar && (
                    <CalendarModal 
                        onClose={() => setShowCalendar(false)} 
                        onSelectDate={(date: string) => {
                        setSelectedDate(date);    
                        setShowCalendar(false);   
                        }}
                        selectedDate={selectedDate}
                    />
                )}

                {/* 주문 추가 모달 */}
                {showAddModal && (
                    <AddOrderModal
                        onClose={() => setShowAddModal(false)}
                        onAdd={(newOrder) => {
                            setAssemblyData((prev) => [...prev, newOrder]); 
                            setShowAddModal(false);
                        }}  
                    />  
                )}

                {/* 주문 수정 모달 */}
                {showEditModal && editOrder && (

                    <EditOrderModal
                        editingOrder={editOrder}
                        onClose={() => {
                            setShowEditModal(false);
                            setEditOrder(null);
                        }}
                        onUpdate={handleUpdateOrder}
                        
                    />  
                )}
                
            </div>
        );

    }
};

export default RealtimeAssemblyView;