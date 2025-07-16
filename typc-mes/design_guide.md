# 3View 탄소관리 종합 솔루션 디자인 가이드

## 디자인 철학

3View 탄소관리 종합 솔루션은 복잡한 탄소 배출 데이터를 직관적이고 효율적으로 관리할 수 있도록 설계되었습니다. 사용자 중심의 디자인으로 추가 매뉴얼 없이도 쉽게 사용할 수 있으며, 특히 태블릿 환경에서 손가락 터치만으로도 원활하게 조작이 가능합니다.

## 핵심 디자인 컨셉

1. **직관적인 계층형 네비게이션**
2. **스마트 데이터 입력 시스템**
3. **시각적 데이터 모델링**
4. **데이터 시각화 대시보드**
5. **반응형 모듈식 레이아웃**
6. **색상 및 시각적 코드화 시스템**
7. **맥락 지원 시스템**
8. **데이터 품질 관리 인터페이스**

## 색상 시스템

### 주요 색상

| 프로그램 | 주요 색상 | Tailwind 클래스 | 용도 |
|----------|----------|-----------------|------|
| 공통기준정보 | 파란색 | blue-500, blue-600 | 메뉴, 버튼, 강조 요소 |
| OCF | 보라색 | purple-500, purple-600 | OCF 관련 요소 |
| PCF | 청록색 | teal-500, teal-600 | PCF 관련 요소 |
| CBAM | 주황색 | orange-500, orange-600 | CBAM 관련 요소 |

### 보조 색상

| 색상 | Tailwind 클래스 | 용도 |
|------|----------------|------|
| 흰색 | white | 배경, 카드 |
| 회색 (밝은) | gray-100, gray-200 | 배경, 비활성 요소 |
| 회색 (중간) | gray-300, gray-400 | 테두리, 구분선 |
| 회색 (어두운) | gray-500, gray-600 | 부가 텍스트 |
| 검정 | gray-800, gray-900 | 주요 텍스트 |

## 타이포그래피

### 폰트 패밀리
- 기본 시스템 폰트 사용: `font-sans`

### 크기

| 요소 | Tailwind 클래스 | 용도 |
|------|----------------|------|
| 초대형 제목 | text-5xl | 메인 타이틀 |
| 대형 제목 | text-3xl, text-2xl | 섹션 제목, 페이지 제목 |
| 중형 제목 | text-xl | 카드 제목, 서브 섹션 |
| 본문 | text-base | 기본 텍스트 |
| 작은 텍스트 | text-sm | 부가 정보, 라벨 |

### 두께

| 요소 | Tailwind 클래스 | 용도 |
|------|----------------|------|
| 초굵게 | font-extrabold | 메인 타이틀 |
| 굵게 | font-bold | 섹션 제목, 강조 |
| 중간 굵기 | font-semibold | 카드 제목, 보조 강조 |
| 일반 | font-normal | 본문 텍스트 |
| 가볍게 | font-light | 부가 정보 |

## 컴포넌트 가이드라인

### 버튼

#### 주요 버튼
```html
<button class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
    불러오기
</button>
```

#### 프로그램 선택 버튼
```html
<button class="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    공통기준정보
</button>
```

#### 아이콘 버튼
```html
<button class="p-2 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <!-- 아이콘 경로 -->
    </svg>
</button>
```

### 카드

#### 프로그램 카드
```html
<div class="program-card bg-white rounded-lg shadow-lg p-6 cursor-pointer">
    <div class="flex items-center justify-center h-24 mb-4">
        <!-- 아이콘 -->
    </div>
    <h2 class="text-xl font-semibold text-center mb-2">카드 제목</h2>
    <p class="text-gray-600 text-center text-sm">카드 설명</p>
</div>
```

#### 연도 선택 카드
```html
<div class="year-card bg-white rounded-lg shadow p-6 cursor-pointer">
    <div class="flex items-center justify-between">
        <h3 class="text-xl font-semibold text-gray-800">2023</h3>
        <div class="bg-gray-200 rounded-full h-6 w-6 flex items-center justify-center">
            <!-- 체크 아이콘 -->
        </div>
    </div>
    <p class="text-gray-500 mt-2 text-sm">2023년 데이터 관리</p>
</div>
```

### 네비게이션

#### 사이드바 메뉴 항목
```html
<li class="nav-item px-4 py-3 cursor-pointer text-blue-500 hover:underline">
    <div class="flex items-center">
        <svg class="h-5 w-5 mr-3 text-blue-500"><!-- 아이콘 경로 --></svg>
        <span class="text-xl">메뉴 항목</span>
    </div>
</li>
```

#### 뱃지
```html
<span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">공통기준정보</span>
```

### 폼 요소

#### 선택 상자
```html
<select class="block w-full max-w-xs px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
    <option value="">연도 선택</option>
    <option value="2023">2023</option>
</select>
```

## 터치 최적화 가이드라인

1. **최소 터치 영역**:
   - 모든 상호작용 요소(버튼, 링크, 카드 등)의 최소 크기를 44px x 44px로 유지
   - Tailwind 클래스: `min-h-[44px] min-w-[44px]`

2. **터치 피드백**:
   - 모든 터치 요소에 시각적 피드백 제공 (호버, 활성 상태)
   - 터치 애니메이션으로 사용자 행동 확인

3. **간격 최적화**:
   - 터치 요소 간 최소 8px의 간격 유지
   - 모바일/태블릿 환경에서 더 큰 패딩 적용

## 애니메이션 및 트랜지션

### 카드 호버 효과
```css
.program-card {
    transition: all 0.3s ease;
}
.program-card:hover {
    transform: translateY(-5px);
}
```

### 연도 카드 선택 효과
```css
.year-card {
    transition: all 0.2s ease;
}
.year-card:hover {
    transform: scale(1.05);
}
.year-card.selected {
    border: 2px solid #3B82F6;
    background-color: rgba(59, 130, 246, 0.1);
}
```

## 레이아웃 구조

### 기본 페이지 레이아웃
```html
<div class="container mx-auto px-4 py-8">
    <!-- 페이지 콘텐츠 -->
</div>
```

### 그리드 레이아웃
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <!-- 그리드 아이템 -->
</div>
```

### 사이드바와 콘텐츠 영역
```html
<div class="flex h-screen">
    <!-- 사이드바 -->
    <aside class="w-64 bg-white shadow-md">
        <!-- 사이드바 콘텐츠 -->
    </aside>
    
    <!-- 메인 콘텐츠 -->
    <main class="flex-1 p-6 bg-gray-100 overflow-auto">
        <!-- 메인 콘텐츠 -->
    </main>
</div>
```

## 접근성 고려사항

1. **색상 대비**:
   - 텍스트와 배경 간 충분한 대비 제공 (WCAG 2.1 AA 기준 준수)
   - 색상만으로 정보를 구분하지 않고 아이콘, 텍스트 등 보조 수단 함께 사용

2. **키보드 접근성**:
   - 모든 상호작용 요소는 키보드로 접근 가능하도록 구현
   - 포커스 상태 명확히 표시

3. **스크린 리더 지원**:
   - 의미 있는 대체 텍스트 제공
   - ARIA 속성 적절히 사용

## 반응형 디자인 브레이크포인트

| 브레이크포인트 | 화면 크기 | Tailwind 클래스 |
|---------------|-----------|----------------|
| 모바일 | < 640px | (기본) |
| 태블릿 | >= 640px | sm: |
| 태블릿 가로 | >= 768px | md: |
| 작은 데스크톱 | >= 1024px | lg: |
| 큰 데스크톱 | >= 1280px | xl: |

## 모범 사례

1. **일관성 유지**:
   - 동일한 기능은 동일한 디자인 패턴 사용
   - 프로그램별 색상 체계 일관되게 적용

2. **로딩 상태 명확히 표시**:
   - 데이터 로딩 중일 때 스켈레톤 UI 또는 스피너 표시
   - 사용자가 현재 상태를 이해할 수 있도록 시각적 피드백 제공

3. **오류 처리**:
   - 오류 발생 시 명확한 메시지와 해결 방법 제시
   - 인라인 오류 표시로 사용자가 즉시 문제를 인식할 수 있도록 함

4. **데이터 저장 자동화**:
   - 사용자 입력 중 자동 저장 기능 구현
   - 작업 중단 시 복구 가능하도록 상태 유지

## 성능 최적화

1. **레이지 로딩**:
   - 화면에 보이는 콘텐츠만 우선 로드
   - 대량의 데이터는 필요할 때만 로드

2. **이미지 최적화**:
   - SVG 아이콘 사용으로 해상도 독립적 UI 구현
   - 필요한 경우 이미지 크기 최적화

3. **렌더링 최적화**:
   - 복잡한 UI 컴포넌트는 가상화 기법 사용
   - DOM 변경 최소화로 리플로우/리페인트 감소

## 디자인 자동화 및 컴포넌트화

1. **재사용 가능한 컴포넌트**:
   - 동일한 디자인 요소는 재사용 가능한 컴포넌트로 추출
   - 일관된 스타일과 동작 보장

2. **Tailwind 유틸리티 클래스 활용**:
   - 반복적인 스타일은 Tailwind 유틸리티 클래스로 관리
   - 필요한 경우 커스텀 클래스 확장

