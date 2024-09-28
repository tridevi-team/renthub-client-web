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
          href: '/dashboard',
          label: 'Dashboard',
          active: pathname === '/dashboard',
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
          active: pathname.includes('/accounts'),
          icon: Users,
          submenus: [
            {
              href: '/accounts/list',
              label: 'Quản lý Tài khoản',
              active: pathname === '/accounts/list',
            },
            {
              href: '/accounts/roles',
              label: 'Quản lý Vai trò',
              active: pathname === '/accounts/roles',
            },
          ],
        },
        {
          href: '/hostels',
          label: 'Nhà trọ',
          active: pathname.includes('/hostels'),
          icon: Home,
          submenus: [
            {
              href: '/hostels/list',
              label: 'Quản lý Nhà trọ',
              active: pathname === '/hostels/list',
            },
            {
              href: '/hostels/floors',
              label: 'Quản lý Tầng',
              active: pathname === '/hostels/floors',
            },
            {
              href: '/hostels/rooms',
              label: 'Quản lý Phòng trọ',
              active: pathname === '/hostels/rooms',
            },
            {
              href: '/hostels/devices',
              label: 'Quản lý Thiết bị',
              active: pathname === '/hostels/devices',
            },
            {
              href: '/hostels/services',
              label: 'Quản lý Dịch vụ',
              active: pathname === '/hostels/services',
            },
          ],
        },
        {
          href: '/tenants',
          label: 'Khách thuê',
          active: pathname.includes('/tenants'),
          icon: UserCircle,
          submenus: [
            {
              href: '/tenants/list',
              label: 'Quản lý Khách thuê',
              active: pathname === '/tenants/list',
            },
            {
              href: '/tenants/contracts',
              label: 'Quản lý Hợp đồng',
              active: pathname === '/tenants/contracts',
            },
            {
              href: '/tenants/feedback',
              label: 'Quản lý Phản ánh',
              active: pathname === '/tenants/feedback',
            },
            {
              href: '/tenants/notifications',
              label: 'Quản lý Thông báo',
              active: pathname === '/tenants/notifications',
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
              active: pathname === '/statistics/contracts',
            },
            {
              href: '/statistics/tenants',
              label: 'Khách thuê',
              active: pathname === '/statistics/tenants',
            },
            {
              href: '/statistics/devices',
              label: 'Thiết bị',
              active: pathname === '/statistics/devices',
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
          active: pathname === '/settings',
          icon: Settings,
          submenus: [],
        },
      ],
    },
  ];
}
