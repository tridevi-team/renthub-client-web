import dayjs from 'dayjs';

export function Footer() {
  return (
    <div className="z-20 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-5 flex h-14 items-center md:mx-8">
        <p className="text-muted-foreground text-xs leading-loose md:text-sm">
          {dayjs().year()} &copy; RentHub. All rights reserved.
        </p>
      </div>
    </div>
  );
}
