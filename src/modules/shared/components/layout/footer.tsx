import dayjs from 'dayjs';

export function Footer() {
  return (
    <div className="mr-5 flex h-9 items-center justify-end bg-zinc-50 md:mr-8">
      <p className="text-xs leading-loose md:text-sm">
        {dayjs().year()} &copy; RentHub. All rights reserved. Version 1.0
      </p>
    </div>
  );
}
