import { generateToken, messaging } from '@app/firebase';
import { cn } from '@app/lib/utils';
import { notificationRepositories } from '@shared/apis/notification.api';
import { Button } from '@shared/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@shared/components/ui/popover';
import { ScrollArea } from '@shared/components/ui/scroll-area';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import to from 'await-to-js';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import relativeTime from 'dayjs/plugin/relativeTime';
import { onMessage } from 'firebase/messaging';
import { Bell } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-aria-components';
import { unstable_batchedUpdates } from 'react-dom';
import { toast } from 'sonner';
dayjs.extend(relativeTime);

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

export function NotificationPopover() {
  const [t] = useI18n();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    const [err, resp]: any[] = await to(
      notificationRepositories.list({
        searchParams: {
          page: 1,
          pageSize: 20,
          sorting: [{ field: 'createdAt', direction: 'desc' }],
        },
      }),
    );
    if (err) return;
    const data = resp?.data?.results || [];
    const mappedData = data.map((item: any) => {
      const { title, content, createdAt, status } = item;
      return {
        id: item.id,
        title,
        description: content,
        time:
          dayjs().diff(dayjs(createdAt), 'day') < 1
            ? dayjs(createdAt).locale('vi').fromNow()
            : dayjs(createdAt).locale('vi').toNow(),
        read: status === 'read',
      };
    });
    unstable_batchedUpdates(() => {
      setNotifications(mappedData);
      setUnreadCount(
        (mappedData || []).filter((n: Notification) => !n.read).length,
      );
    });
  };

  const handleOnNewNotification = ({
    title,
    body,
  }: { title: string; body?: string }) => {
    toast.info(title, {
      description: body ?? '',
      important: true,
      duration: 10000,
    });
    fetchNotifications();
  };

  const handleMarkAllAsRead = async () => {
    setNotifications((prev) =>
      prev.map((n) => ({
        ...n,
        read: true,
      })),
    );
    const ids = (notifications || []).map((n) => n.id);
    const [err] = await to(notificationRepositories.updateStatus({ ids }));
    if (err) return;
    setUnreadCount(0);
  };

  useEffect(() => {
    generateToken();
    const unsubscribe = onMessage(messaging, (payload) => {
      const { title, body } = payload.notification ?? {};
      if (title) handleOnNewNotification({ title, body });
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, []);

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
