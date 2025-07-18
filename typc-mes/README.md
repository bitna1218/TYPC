# 프로젝트 개요
이 프로젝트는 React + TypeScript 기반의 조립 관리 시스템의 클라이언트 프론트엔드쪽 부분입니다. 
핵심 기능은 주문 목록(List), 조립 상태 관리(Assembly), 부품 추가 및 수정 모달(Modal)로 구성되어 있으며, 데이터는 `test-data`에 임시데이터로 관리되고 있습니다.

# 폴더구조를 세분화한 목적
처음 받은 코드가 한개의 메인화면.tsx에 UI와 함수, mock data가 한파일에 뒤 섞여 있어 
전체적인 구조 파악이 어렵고 추후 유지 보수시 어려움이 있을거 같아 메인화면에 있는 UI를 컴포넌트를 분리하여 유지 보수시 한눈에 파악 할 수 있도록 메인화면.tsx에 최대한 분리 하였습니다.

# url
http://localhost:3000/test

# 폴더구조 설명

### src/test-typc-components/
- test-components/ => 컴포넌트 폴더
- test-data/ => mock data 폴더
- test3.tsx => 이 프로젝트 메인 화면으로 자식 컴포넌트 의 상태를 관리하고 props를 전달하는 역할.

### src/test-typc-components/test-data/
- test-assemblyData.ts => 조립 order 목록에 대한 mock data
- test-partsInventoryData.ts => 조립 부품 목록에 대한 mock data
                     
### src/test-typc-components/test-components/
- Assembly/ => 실제 조립하는 화면  컴포넌트 폴더
- List/ => 주문 목록 관련 컴포넌트 폴더
- Modal/ => 주문추가, 부품 추가 및 수정 모달 관련 폴더더                

### src/test-typc-components/test-components/Assembly/
- test-AssemblyButton.tsx => 조립화면 부품추가 버튼 
- test-AssemblyProgressBar.tsx => 조립화면 진행 바 
- test-AssemblyProgressSection.tsx => 조립화면 부품목록  
- test-AssemblyTimerSection.tsx => 조립화면 타이머 
- test-ManagementHeader.tsx => 조립화면 헤더 
- test-PhotoUploadSection.tsx => 사진 업로드
- test-SelectedDateBanner.tsx =>  선택된 날짜 배너
- test-SelectedOrderSummary.tsx => 선택된 주문 요약

### src/test-typc-components/test-components/List/
- test-AddOrderButton.tsx => 주문 추가 버튼 
- test-MainHeader.tsx => 주문 목록 헤더 
- test-OrderListSection.tsx => 주문 목록 
- test-StatusFilterButtonsProps.tsx => 주문 목록 상태 필터 버튼
- test-StatusLegend.tsx => 주문 목록 상태 범례

### src/test-typc-components/test-components/Modal/
- test-AddComponentModal.tsx => 부품 추가 모달 
- test-AddOrderModal.tsx => 주문 추가 모달  
- test-CalendarModal.tsx => 달력 모달 
- test-EditOrderModal.tsx => 주문 수정 모달 


