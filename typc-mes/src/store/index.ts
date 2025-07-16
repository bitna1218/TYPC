import { LocalStorage } from '@/utils/storage';
import { create } from 'zustand';

// 전역 상태 인터페이스 정의
interface AppState {
  selectedProgram: string;
  selectedYear: string;
  siteName: string;
  siteId: string;
  setSelectedProgram: (program: string) => void;
  setSelectedYear: (year: string) => void;
  setSiteInfo: (id: string, name: string) => void;
}

// Zustand 스토어 생성
export const useAppStore = create<AppState>((set) => ({
  selectedProgram: '',
  selectedYear: '',
  siteName: '',
  siteId: '',
  setSelectedProgram: (program) => set({ selectedProgram: program }),
  setSelectedYear: (year) => set({ selectedYear: year }),
  setSiteInfo: (id, name) => set({ siteId: id, siteName: name }),
}));

// 브라우저 환경에서만 로컬 스토리지 상태 복원
if (typeof window !== 'undefined') {
  const storedProgram = LocalStorage.get('selectedProgram');
  const storedYear = LocalStorage.get('selectedYear');
  const storedSiteId = LocalStorage.get('selectedSiteId');
  const storedSiteName = LocalStorage.get('selectedSiteName');

  if (storedProgram) {
    useAppStore.setState({ selectedProgram: storedProgram });
  }

  if (storedYear) {
    useAppStore.setState({ selectedYear: storedYear });
  }

  if (storedSiteId) {
    useAppStore.setState({ siteId: storedSiteId });
  }

  if (storedSiteName) {
    useAppStore.setState({ siteName: storedSiteName });
  }
}
