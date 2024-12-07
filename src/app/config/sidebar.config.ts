import {
  BarChart2,
  Home,
  MessageSquareDot,
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
              href: '/users',
              label: 'Quản lý Tài khoản',
              active: pathname.includes('/users'),
            },
            {
              href: '/roles',
              label: 'Quản lý Vai trò',
              active: pathname.includes('/roles'),
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
              href: '/floors',
              label: 'Quản lý Tầng',
              active: pathname.includes('/floors'),
            },
            {
              href: '/rooms',
              label: 'Quản lý Phòng',
              active: pathname.includes('/rooms'),
            },
            {
              href: '/equipments',
              label: 'Quản lý Thiết bị',
              active: pathname.includes('/equipments'),
            },
            {
              href: '/services',
              label: 'Quản lý Dịch vụ',
              active: pathname.includes('/services'),
            },
            {
              href: '/bills',
              label: 'Quản lý Hóa đơn',
              active: pathname.includes('/bills'),
            },
            {
              href: '/payments',
              label: 'Quản lý Thanh toán',
              active: pathname.includes('/payments'),
            },
            {
              href: '/contract-templates',
              label: 'Quản lý Mẫu hợp đồng',
              active: pathname.includes('/contract-templates'),
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
              href: '/contracts',
              label: 'Quản lý Hợp đồng',
              active: pathname.includes('/contracts'),
            },
            {
              href: '/feedback',
              label: 'Quản lý Phản ánh',
              active: pathname.includes('/feedback'),
            },
          ],
        },
      ],
    },
    {
      groupLabel: 'Thống kê',
      menus: [
        {
          href: '/statistics',
          label: 'Thống kê',
          active: pathname.includes('/statistics'),
          icon: BarChart2,
          submenus: [
            {
              href: '/stats-bills',
              label: 'Hóa đơn',
              active: pathname.includes('/stats-bills'),
            },
            // {
            //   href: '/stats-contracts',
            //   label: 'Hợp đồng',
            //   active: pathname.includes('/stats-contracts'),
            // },
            // {
            //   href: '/stats-equipments',
            //   label: 'Thiết bị',
            //   active: pathname.includes('/stats-equipments'),
            // },
          ],
        },
      ],
    },
    {
      groupLabel: 'Khác',
      menus: [
        {
          href: '/notifications',
          label: 'Quản lý Thông báo',
          active: pathname.includes('/notifications'),
          icon: MessageSquareDot,
          submenus: [],
        },
      ],
    },
  ];
}
