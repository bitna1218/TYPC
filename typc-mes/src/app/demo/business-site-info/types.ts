export type StepStatus = 'completed' | 'in-progress' | 'available' | 'locked';

export interface BusinessSite {
  id: string;
  name: string;
  isSelected?: boolean;
  businessInfoStatus: StepStatus;
  manufacturingProcessStatus: StepStatus;
  utilityFacilityStatus: StepStatus;
}

export interface CompanyInfo {
  name: string;
  representative: string;
  registrationNumber: string;
} 