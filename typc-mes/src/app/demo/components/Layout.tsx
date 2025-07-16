'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { FaCalendarAlt, FaMapMarkerAlt, FaIndustry, FaBuilding } from 'react-icons/fa';
import { MenuItem } from '../types';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
  selectedProgram: string;
  selectedYear: string | null;
  activeMenu: string;
}

export default function Layout({
  children,
  selectedProgram,
  selectedYear,
  activeMenu,
}: LayoutProps) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(['site-info']);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 서버 사이드 렌더링 시 오류 방지
  if (!isMounted) {
    return null;
  }

  const menuItems: MenuItem[] = [
    {
      id: 'year-selection',
      name: '조직 정보',
      icon: FaCalendarAlt,
      path: '/demo/year-selection',
    },
    {
      id: 'site-info',
      name: '사업장 정보',
      icon: FaMapMarkerAlt,
      path: '/demo/business-site-info',
      isCollapsible: true,
      subItems: [
        {
          id: '2025',
          name: '2025년',
          path: '/demo/business-site-info',
        },
      ],
    },
    {
      id: 'manufacturing-process-data',
      name: '제조공정 데이터',
      icon: FaIndustry,
      path: '/demo/manufacturing-process-data',
    },
    {
      id: 'utility-facility-data',
      name: '유틸리티시설 데이터',
      icon: FaBuilding,
      path: '/demo/utility-facility-data',
    },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMenuItem = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };

  const handleMenuClick = (menuId: string): void => {
    const menuItem = menuItems.find((item) => item.id === menuId);

    if (menuItem?.isCollapsible) {
      if (isCollapsed) {
        setIsCollapsed(false);
        if (!expandedItems.includes(menuId)) {
          toggleMenuItem(menuId);
        }
      } else {
        toggleMenuItem(menuId);
      }
    } else if (menuItem?.path) {
      router.push(menuItem.path);
    }
  };

  const handleSubMenuClick = (e: React.MouseEvent, path: string): void => {
    e.stopPropagation(); // 부모 메뉴 클릭 이벤트 방지
    router.push(path);
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-100">
      <Header selectedProgram={selectedProgram} selectedYear={selectedYear} />

      <div className="flex flex-1 overflow-hidden">
        <div className="h-full">
          <Sidebar
            menuItems={menuItems}
            activeMenu={activeMenu}
            onMenuClick={handleMenuClick}
            isCollapsed={isCollapsed}
            toggleSidebar={toggleSidebar}
            expandedItems={expandedItems}
            onSubMenuClick={handleSubMenuClick}
          />
        </div>

        <main className="flex-1 overflow-auto bg-gray-100 p-6">{children}</main>
      </div>
    </div>
  );
}
