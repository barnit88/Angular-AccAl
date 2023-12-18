export interface MenuItem {
  name: string;
  icon: any;
  hoverIcon?: any;
  displayText: string;
  navPath: string;
  activeClass?: boolean;
  hovering?: boolean;
}

export const menuObjects: MenuItem[] = [
  {
    name: 'Dashboard',
    icon: 'assets/icons/menu/Dashboard.svg',
    hoverIcon: 'assets/icons/menu/DashboardHover.svg',
    displayText: 'Dashboard',
    navPath: '/',
    activeClass: true,
    hovering: false,
  },
  {
    name: 'Integrations',
    icon: 'assets/icons/menu/Integrations.svg',
    hoverIcon: 'assets/icons/menu/IntegrationsHover.svg',
    displayText: 'Integration',
    navPath: 'integration',
    hovering: false,
  },
  // {
  //   name: 'History',
  //   icon: 'assets/icons/history.svg',
  //   displayText: 'History',
  //   navPath: 'history',
  // },
  // {
  //   name: 'Access Review',
  //   icon: 'assets/icons/access-review.svg',
  //   displayText: 'Access Review',
  //   navPath: 'access-review',
  // },
  // {
  //   name: 'Settings',
  //   icon: 'assets/icons/menu/Setting.svg',
  //   hoverIcon: 'assets/icons/menu/SettingHover.svg',
  //   displayText: 'Settings',
  //   navPath: 'company-setting',
  //   hovering: false,
  // },
  // {
  //   name: 'Analytics',
  //   icon: 'assets/icons/users.svg',
  //   displayText: 'Analytics',
  //   navPath: 'explore',
  // },
  {
    name: 'Get Help',
    icon: 'assets/icons/menu/Help.svg',
    hoverIcon: 'assets/icons/menu/HelpHover.svg',
    displayText: 'Get Help',
    navPath: 'get-help',
    hovering: false,
  },
];
