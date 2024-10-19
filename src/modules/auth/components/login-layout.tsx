import { cn } from '@app/lib/utils';

import loginBg from '@assets/images/login_bg.jpg';
import { BRAND_NAME } from '@shared/constants/general.constant';
import { House } from 'lucide-react';

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full">
      {/* image */}
      <section className="hidden w-1/2 shadow-2xl md:block">
        <span className="relative h-screen w-full md:flex md:items-center md:justify-center">
          <img
            src={loginBg}
            alt="BG-Side of Login Page"
            loading="lazy"
            className="h-full object-cover"
            aria-label="Login Page Background"
          />
        </span>
      </section>

      {/* form */}
      <section className="flex min-h-screen w-full flex-col justify-center px-10 md:w-1/2 xl:px-20">
        <div className="mb-2 flex items-center justify-center gap-2 text-blue-600">
          <House className="mr-1 h-8 w-8" />
          <h1
            className={cn(
              'whitespace-nowrap font-bold text-3xl transition-[transform,opacity,display] duration-300 ease-in-out',
            )}
          >
            {BRAND_NAME}
          </h1>
        </div>
        {children}
      </section>
    </div>
  );
}
