'use client';

import { useRouter } from 'next/navigation';
import { FaRegFileAlt } from 'react-icons/fa';
// import { IoBarChartOutline } from 'react-icons/io5';
// import { GrCube } from 'react-icons/gr';
// import { TbScale } from 'react-icons/tb';
import { useAppStore } from '../store';
import { Program } from '../types';
import { route } from '@/constants/route';
import { LocalStorage } from '@/utils/storage';

export default function HomePage() {
  const router = useRouter();
  const setSelectedProgram = useAppStore((state) => state.setSelectedProgram);

  const selectProgram = (program: string): void => {
    LocalStorage.set('selectedProgram', program);
    setSelectedProgram(program);
    router.push(route.corp.year.path);
  };

  const commonInfo: Program = {
    id: 'common',
    name: '공통기준정보',
    description: '조직 및 사업장 정보 관리',
    color: 'blue',
    icon: FaRegFileAlt,
  };

  // const programs: Program[] = [
  //   {
  //     id: 'ocf',
  //     name: 'OCF',
  //     description: '조직 탄소발자국 관리',
  //     color: 'purple',
  //     icon: IoBarChartOutline,
  //   },
  //   {
  //     id: 'pcf',
  //     name: 'PCF',
  //     description: '제품 탄소발자국 관리',
  //     color: 'teal',
  //     icon: GrCube,
  //   },
  //   {
  //     id: 'cbam',
  //     name: 'CBAM',
  //     description: 'EU 탄소국경조정제도 관리',
  //     color: 'orange',
  //     icon: TbScale,
  //   },
  // ];

  // const getColorClasses = (
  //   color: string
  // ): { bg: string; hover: string; text: string } => {
  //   const colorMap: Record<
  //     string,
  //     { bg: string; hover: string; text: string }
  //   > = {
  //     blue: {
  //       bg: 'bg-blue-500',
  //       hover: 'hover:bg-blue-600',
  //       text: 'text-blue-500',
  //     },
  //     purple: {
  //       bg: 'bg-purple-500',
  //       hover: 'hover:bg-purple-600',
  //       text: 'text-purple-500',
  //     },
  //     teal: {
  //       bg: 'bg-teal-500',
  //       hover: 'hover:bg-teal-600',
  //       text: 'text-teal-500',
  //     },
  //     orange: {
  //       bg: 'bg-orange-500',
  //       hover: 'hover:bg-orange-600',
  //       text: 'text-orange-500',
  //     },
  //   };

  //   return colorMap[color] || colorMap.blue;
  // };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4 py-8">
      <div className="container mx-auto max-w-4xl text-center">
        <h1 className="mb-6 text-5xl font-extrabold text-slate-800">
          3View 탄소관리 종합 솔루션
        </h1>
        <p className="mb-12 text-xl text-gray-500">
          사용하고자 하는 프로그램을 선택해 주세요.
        </p>

        {/* 공통기준정보 - Non-clickable, placed above */}
        <div className="mb-10 w-full p-6">
          <div
            className="cursor-pointer rounded-lg bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-lg"
            onClick={() => selectProgram(commonInfo.id)}
          >
            <div className="mb-4 flex h-24 items-center justify-center">
              <FaRegFileAlt className={`h-16 w-16 text-blue-500`} />
            </div>
            <div className="text-center">
              <h2 className="mb-2 text-center text-2xl font-semibold text-gray-900">
                {commonInfo.name}
              </h2>
              <p className="text-center text-gray-600">
                {commonInfo.description}
              </p>
            </div>
          </div>
        </div>

        {/* OCF, PCF, CBAM - Clickable options */}
        {/* <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {programs.map((program) => {
            const colorClasses = getColorClasses(program.color);
            const Icon = program.icon;

            return (
              <div
                key={program.id}
                className='program-card bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300'
              >
                <div className='flex items-center justify-center h-24 mb-4'>
                  <Icon className={`h-16 w-16 ${colorClasses.text}`} />
                </div>
                <h2 className='text-xl font-semibold text-center mb-2 text-gray-900'>
                  {program.name}
                </h2>
                <p className='text-gray-600 text-center text-sm'>
                  {program.description}
                </p>
              </div>
            );
          })}
        </div> */}
      </div>
    </main>
  );
}
