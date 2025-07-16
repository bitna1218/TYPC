'use client';

import {
  IoIosArrowDropright,
  IoIosArrowDropleft,
  IoIosArrowUp,
  IoIosArrowDown,
} from 'react-icons/io';
import { MenuItem } from '../types';

interface SidebarProps {
  menuItems: MenuItem[];
  activeMenu: string;
  onMenuClick: (menuId: string) => void;
  isCollapsed: boolean;
  toggleSidebar: () => void;
  expandedItems: string[];
  onSubMenuClick: (e: React.MouseEvent, path: string) => void;
}

export default function Sidebar({
  menuItems,
  activeMenu,
  onMenuClick,
  isCollapsed,
  toggleSidebar,
  expandedItems,
  onSubMenuClick,
}: SidebarProps) {
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
          const hasActiveSubItem = item.id === 'site-info' && activeMenu === item.id;
          const parentIsHighlighted =
            (activeMenu === item.id && !hasActiveSubItem) || hasActiveSubItem;

          return (
            <li key={item.id}>
              <div
                className={`nav-item flex cursor-pointer items-center rounded-md p-2 transition-colors ${
                  parentIsHighlighted
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
                onClick={() => onMenuClick(item.id)}
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
                      {item.subItems.map((subItem) => (
                        <li
                          key={subItem.id}
                          className={`cursor-pointer rounded-md p-2 text-sm transition-colors ${
                            activeMenu === item.id
                              ? 'font-medium text-blue-600'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                          }`}
                          onClick={(e) => onSubMenuClick(e, subItem.path)}
                        >
                          <span className="whitespace-nowrap">
                            {subItem.name}
                          </span>
                        </li>
                      ))}
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
