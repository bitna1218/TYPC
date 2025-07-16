'use client';

import { useState } from 'react';
import {
  IoIosArrowDropright,
  IoIosArrowDropleft,
  IoIosArrowUp,
  IoIosArrowDown,
} from 'react-icons/io';
import { MenuItem } from '../../types';
import { FaCalendarAlt, FaMapMarkerAlt, FaIndustry } from 'react-icons/fa';
import { route } from '@/constants/route';
import { usePathname, useRouter } from 'next/navigation';
import useCorpYear from '@/hooks/useCorpYear';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const { allCorpYearListResponse, isLoading: isCorpYearListLoading } =
    useCorpYear();

  const menuItems: MenuItem[] = [
    {
      id: 'year-selection',
      name: '조직 정보',
      icon: FaCalendarAlt,
      path: route.corp.year.path,
      active: pathname.startsWith(route.corp.year.path),
    },
    {
      id: 'site-info',
      name: '사업장 정보',
      icon: FaMapMarkerAlt,
      path: route.bizSite.path,
      active: pathname.startsWith(route.bizSite.path),
      isCollapsible: true,
      subItems: allCorpYearListResponse?.result?.content.map((corpYear) => ({
        id: corpYear.id,
        name: `${corpYear.year}년`,
        path: route.bizSite.corpYear.path(corpYear.id),
        active: pathname === route.bizSite.corpYear.path(corpYear.id),
      })),
    },
    {
      id: 'manufacturing-process-data',
      name: '제조공정 데이터',
      icon: FaIndustry,
      path: '/manufacturing-process-data',
      active: pathname.startsWith(route.manufacturingProcessData.path),
    },
  ];

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

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
    <aside
      className={`h-full border-r border-gray-300 bg-white p-4 shadow-md transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      } overflow-y-auto`}
    >
      <div className="mb-4 flex items-center justify-between">
        {!isCollapsed && (
          <h2 className="whitespace-nowrap text-xl font-bold">메뉴</h2>
        )}
        <button
          onClick={toggleSidebar}
          className="rounded-full p-2 transition-colors hover:bg-gray-200"
        >
          {isCollapsed ? (
            <IoIosArrowDropright size={20} />
          ) : (
            <IoIosArrowDropleft size={20} />
          )}
        </button>
      </div>
      <ul className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isExpanded = expandedItems.includes(item.id);
          const hasActiveSubItem =
            item.subItems?.some((subItem) => subItem.active) ?? false;
          const parentIsHighlighted =
            (item.active && !hasActiveSubItem) || hasActiveSubItem;

          return (
            <li key={item.id}>
              <div
                className={`nav-item flex cursor-pointer items-center rounded-md p-2 transition-colors ${
                  parentIsHighlighted
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
                onClick={() => handleMenuClick(item.id)}
              >
                <div className="flex items-center">
                  <div
                    className={`relative flex items-center ${
                      isCollapsed ? 'tooltip-container' : ''
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'} ${
                        parentIsHighlighted ? 'text-blue-600' : 'text-gray-600'
                      }`}
                    />
                    {isCollapsed && (
                      <div className="tooltip-sidebar">{item.name}</div>
                    )}
                  </div>
                  {!isCollapsed && (
                    <span className="whitespace-nowrap text-sm font-medium">
                      {item.name}
                    </span>
                  )}
                </div>

                {/* Collapse/Expand Arrow */}
                {!isCollapsed && item.isCollapsible && (
                  <div className="ml-auto">
                    {isExpanded ? (
                      <IoIosArrowUp className="h-4 w-4" />
                    ) : (
                      <IoIosArrowDown className="h-4 w-4" />
                    )}
                  </div>
                )}
              </div>

              {/* Sub Menu Items */}
              {!isCollapsed && item.subItems && (
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                    isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <ul className="ml-8 mt-1 max-h-60 space-y-1 overflow-y-auto border-l border-gray-200 py-1 pl-4 pr-2">
                      {isCorpYearListLoading ? (
                        <li className="p-2 text-sm text-gray-400"></li>
                      ) : item.subItems && item.subItems.length > 0 ? (
                        item.subItems.map((subItem) => (
                          <li
                            key={subItem.id}
                            className={`cursor-pointer rounded-md p-2 text-sm transition-colors ${
                              subItem.active
                                ? 'font-medium text-blue-600'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                            }`}
                            onClick={(e) => handleSubMenuClick(e, subItem.path)}
                          >
                            <span className="whitespace-nowrap">
                              {subItem.name}
                            </span>
                          </li>
                        ))
                      ) : (
                        <li className="cursor-default p-0 text-sm text-gray-400">
                          연도별 법인을 먼저 등록하세요.
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
