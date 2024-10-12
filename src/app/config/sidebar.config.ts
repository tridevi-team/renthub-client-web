import {
  BarChart2,
  DollarSign,
  Home,
  Settings,
  UserCircle,
  Users,
  type LucideIcon,
} from 'lucide-react';

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: '',
      menus: [
        {
          href: '/',
          label: 'Dashboard',
          active: pathname === '/',
          icon: Home,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: 'Quản lý',
      menus: [
        {
          href: '/accounts',
          label: 'Tài khoản',
          active: false,
          icon: Users,
          submenus: [
            {
              href: '/accounts/',
              label: 'Quản lý Tài khoản',
              active: pathname.includes('/accounts'),
            },
            {
              href: '/accounts/roles',
              label: 'Quản lý Vai trò',
              active: pathname.includes('/accounts/roles'),
            },
          ],
        },
        {
          href: '/houses',
          label: 'Nhà trọ',
          active: pathname.includes('/houses'),
          icon: Home,
          submenus: [
            {
              href: '/houses',
              label: 'Quản lý Nhà trọ',
              active: pathname.includes('/houses'),
            },
            {
              href: '/houses/floors',
              label: 'Quản lý Tầng',
              active: pathname.includes('/houses/floors'),
            },
            {
              href: '/houses/rooms',
              label: 'Quản lý Phòng trọ',
              active: pathname.includes('/houses/rooms'),
            },
            {
              href: '/houses/devices',
              label: 'Quản lý Thiết bị',
              active: pathname.includes('/houses/devices'),
            },
            {
              href: '/houses/services',
              label: 'Quản lý Dịch vụ',
              active: pathname.includes('/houses/services'),
            },
          ],
        },
        {
          href: '/renters',
          label: 'Khách thuê',
          active: pathname.includes('/renters'),
          icon: UserCircle,
          submenus: [
            {
              href: '/renters',
              label: 'Quản lý Khách thuê',
              active: pathname.includes('/renters'),
            },
            {
              href: '/renters/contracts',
              label: 'Quản lý Hợp đồng',
              active: pathname.includes('/renters/contracts'),
            },
            {
              href: '/renters/feedback',
              label: 'Quản lý Phản ánh',
              active: pathname.includes('/renters/feedback'),
            },
            {
              href: '/renters/notifications',
              label: 'Quản lý Thông báo',
              active: pathname.includes('/renters/notifications'),
            },
          ],
        },
      ],
    },
    {
      groupLabel: 'Tài chính & Thống kê',
      menus: [
        {
          href: '/finance',
          label: 'Quản lý Tài chính',
          active: pathname.includes('/finance'),
          icon: DollarSign,
          submenus: [],
        },
        {
          href: '/statistics',
          label: 'Thống kê',
          active: pathname.includes('/statistics'),
          icon: BarChart2,
          submenus: [
            {
              href: '/statistics/contracts',
              label: 'Tình trạng hợp đồng',
              active: pathname.includes('/statistics/contracts'),
            },
            {
              href: '/statistics/tenants',
              label: 'Khách thuê',
              active: pathname.includes('/statistics/tenants'),
            },
            {
              href: '/statistics/devices',
              label: 'Thiết bị',
              active: pathname.includes('/statistics/devices'),
            },
          ],
        },
      ],
    },
    {
      groupLabel: 'Khác',
      menus: [
        {
          href: '/settings',
          label: 'Cài đặt',
          active: pathname.includes('/settings'),
          icon: Settings,
          submenus: [],
        },
      ],
    },
  ];
}
