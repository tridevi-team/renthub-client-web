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
    <div className="min-h-screen w-full flex">
      {/* image */}
      <section className="hidden md:block w-1/2 shadow-2xl">
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
      <section className="min-h-screen w-full flex flex-col justify-center px-10 xl:px-20 md:w-1/2">
        <div className="flex items-center gap-2 justify-center mb-2 text-blue-600">
          <House className="w-8 h-8 mr-1" />
          <h1
            className={cn(
              'font-bold text-3xl whitespace-nowrap transition-[transform,opacity,display] ease-in-out duration-300',
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
