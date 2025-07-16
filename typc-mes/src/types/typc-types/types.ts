// 타입 정의
  export interface AssemblyOrder {
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
  
  export interface NewOrder {
    orderNum: string;
    customer: string;
    phone: string;
    product: string;
    orderDate: string;
    notes: string;
  }
  
  export interface PartData {
    brand: string;
    part: string;
    checked: boolean;
  }
  
  export  interface CustomComponent {
    category1: string;
    category2: string;
    category3: string;
    displayName: string;
    checked: boolean;
  }
  
  export  interface NewComponent {
    category1: string;
    category2: string;
    category3: string;
  }
  
  export  interface UploadedPhoto {
    id: number;
    file: File;
    url: string;
    name: string;
  }
  
  export interface PartsInventory {
    [category: string]: {
      [brand: string]: string[];
    };
  }
  
  export  interface CompletionData {
    orderNum: string;
    customer: string;
    totalTime: string;
    startTime: string;
    endTime: string;
  }
  
  export type TimerState = 'ready' | 'running' | 'paused' | 'completed';
  export type ViewState = 'list' | 'assembly';