import { cn } from '@app/lib/utils';
import { Button } from '@shared/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@shared/components/ui/popover';
import { ScrollArea } from '@shared/components/ui/scroll-area';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import { Bell } from 'lucide-react';
import { Link } from 'react-aria-components';

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

export function NotificationPopover() {
  const [t] = useI18n();

  const notifications: Notification[] = [
    {
      id: '1',
      title: 'Thanh toán tiền thuê nhà tháng 11',
      description: 'Vui lòng thanh toán tiền thuê nhà trước ngày 05/11/2023',
      time: '5 phút trước',
      read: false,
    },
    {
      id: '2',
      title: 'Thông báo bảo trì điện nước',
      description:
        'Chúng tôi sẽ bảo trì hệ thống điện nước vào ngày 02/11/2023',
      time: '1 giờ trước',
      read: true,
    },
    {
      id: '3',
      title: 'Yêu cầu sửa chữa đã được xác nhận',
      description: 'Yêu cầu sửa chữa máy lạnh của bạn đã được chấp nhận',
      time: '2 giờ trước',
      read: false,
    },
    {
      id: '4',
      title: 'Nhắc nhở đóng cửa ra vào',
      description: 'Vui lòng đóng cửa ra vào sau 22h để đảm bảo an ninh',
      time: '1 ngày trước',
      read: true,
    },
    {
      id: '5',
      title: 'Hóa đơn điện tháng 10',
      description: 'Hóa đơn điện tháng 10 của bạn đã được cập nhật',
      time: '2 ngày trước',
      read: true,
    },
    {
      id: '6',
      title: 'Thông báo vệ sinh chung cư',
      description: 'Lịch vệ sinh chung cư định kỳ vào Chủ nhật tuần này',
      time: '3 ngày trước',
      read: false,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllAsRead = () => {};

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative h-9 w-9 rounded-full"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="-right-1 -top-1 absolute flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-white text-xs">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex h-[480px] flex-col">
          <div className="border-b p-4">
            <h3 className="font-semibold text-lg">
              {t('common_notifications')}
            </h3>
          </div>

          <ScrollArea className="flex-1">
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    'flex cursor-pointer flex-col gap-2 border-transparent border-l-4 p-4 transition-colors hover:border-blue-500 hover:bg-muted/50',
                    !notification.read && 'bg-blue-50 dark:bg-blue-950/30',
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium">{notification.title}</p>
                    {!notification.read && (
                      <span className="h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {notification.description}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {notification.time}
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="grid grid-cols-2">
              <Link
                onPress={handleMarkAllAsRead}
                className="ml-4 flex h-10 cursor-pointer items-center justify-start font-semibold text-muted-foreground text-sm transition-colors hover:text-primary"
              >
                {t('common_mark_all_as_read')}
              </Link>
              <Link
                href="/notifications"
                className="mr-4 flex h-10 cursor-pointer items-center justify-end font-semibold text-muted-foreground text-sm transition-colors hover:text-primary"
              >
                {t('common_view_all')}
              </Link>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
