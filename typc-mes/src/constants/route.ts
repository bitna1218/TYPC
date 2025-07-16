export const MENU_CODE = {
  CORP: 'CORP',
};

/**
 * 헤더에 해당 연도별 법인의 연도를 표시해야하는 페이지는 경로에 iCorpYear를 포함해야 합니다.
 * 예: 사업장 정보 페이지 => /biz-site/corp-year/${idCorpYear}
 */
export const route = {
  corp: {
    path: '/corp',
    year: {
      path: '/corp/year',
      create: {
        path: '/corp/year/create',
      },
      edit: {
        path: (idCorpYear: string) => `/corp/year/edit/${idCorpYear}`,
      },
    },
  },
  bizSite: {
    path: '/biz-site',
    corpYear: {
      path: (idCorpYear: string) => `/biz-site/corp-year/${idCorpYear}`,
      create: {
        path: (idCorpYear: string) =>
          `/biz-site/corp-year/${idCorpYear}/create`,
      },
      edit: {
        path: (idCorpYear: string, idBizSite: string) =>
          `/biz-site/corp-year/${idCorpYear}/edit/${idBizSite}`,
      },
    },
  },
  manufacturingProcessData: {
    path: '/manufacturing-process-data',
  },
} satisfies Route;

export type Route = Record<string, RouteItem>;

export type RouteItemData = {
  path: string | ((...path: string[]) => void);
  // code: string; // TODO: 향후 다국어 적용할 때 사용
};

export type RouteItem =
  | RouteItemData
  | (RouteItemData & {
      [key: string]: RouteItem;
    });
