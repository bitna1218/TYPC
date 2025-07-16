export type ProgramId = 'common' | 'ocf' | 'pcf' | 'cbam';

export type ProgramColor = 'blue' | 'purple' | 'teal' | 'orange';

export interface Program {
  id: ProgramId;
  name: string;
  description: string;
  color: ProgramColor;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export interface MenuItem {
  id: string;
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  path: string;
  active?: boolean;
  subItems?: SubMenuItem[];
  isCollapsible?: boolean;
}

export interface SubMenuItem {
  id: string;
  name: string;
  path: string;
  active?: boolean;
}
