import dayjs from 'dayjs';

export function Footer() {
  return (
    <div className="z-20 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-5 md:mx-8 flex h-14 items-center">
        <p className="text-xs md:text-sm leading-loose text-muted-foreground">
          {dayjs().year()} &copy; RentHub. All rights reserved.
        </p>
      </div>
    </div>
  );
}
