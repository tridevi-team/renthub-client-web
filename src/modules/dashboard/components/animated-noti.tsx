import { cn } from '@app/lib/utils';
import { AnimatedList } from '@shared/components/extensions/animated-list';

interface Item {
  name: string;
  description: string;
  icon: string;
  color: string;
  time: string;
}

let notifications = [
  {
    name: 'Thanh toán thành công',
    description: 'Hóa đơn phòng 101 đã được thanh toán.',
    time: '15 phút trước',
    icon: '💸',
    color: '#00C9A7',
  },
  {
    name: 'Đăng ký mới',
    description: 'Phòng 201 có người đăng ký nhận thông tin',
    time: '10 phút trước',
    icon: '👤',
    color: '#FFB800',
  },
  {
    name: 'Phản ánh mới',
    description: 'Có một phản ánh mới từ khách thuê.',
    time: '5 phút trước',
    icon: '💬',
    color: '#FF3D71',
  },
  {
    name: 'Hợp đồng được duyệt',
    description: 'Hợp đồng phòng 202 đã được duyệt.',
    time: '2 phút trước',
    icon: '🗞️',
    color: '#1E86FF',
  },
];

notifications = Array.from({ length: 10 }, () => notifications).flat();

const Notification = ({ name, description, icon, color, time }: Item) => {
  return (
    <figure
      className={cn(
        'relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4',
        // animation styles
        'transition-all duration-200 ease-in-out hover:scale-[103%]',
        // light styles
        'bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]',
        // dark styles
        'transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]',
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex size-10 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: color,
          }}
        >
          <span className="text-lg">{icon}</span>
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center whitespace-pre font-medium text-lg dark:text-white ">
            <span className="text-sm sm:text-lg">{name}</span>
            <span className="mx-1">·</span>
            <span className="text-gray-500 text-xs">{time}</span>
          </figcaption>
          <p className="font-normal text-sm dark:text-white/60">
            {description}
          </p>
        </div>
      </div>
    </figure>
  );
};

export function NotiAnimatedList({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        'relative flex h-[500px] w-full flex-col overflow-hidden rounded-lg border bg-background p-6 md:shadow-xl',
        className,
      )}
    >
      <AnimatedList delay={1500}>
        {notifications.map((item, idx) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <Notification {...item} key={idx} />
        ))}
      </AnimatedList>
    </div>
  );
}
