import { cn } from '@app/lib/utils';

import registerBg from '@assets/images/register_bg.png';
import logoImg from '@assets/logo/logo-doc.png';
import { BRAND_NAME } from '@shared/constants/general.constant';

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center">
      <img
        src={registerBg}
        alt="BG-Side of Register Page"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
        aria-label="Register Page Background"
      />
      <div className="relative z-10 w-full max-w-3xl rounded-lg bg-white p-10 shadow-2xl md:w-[600px]">
        {/* title register */}
        <div className="md:-mt-24 mx-48 mb-2 flex items-center justify-center gap-2 rounded-full bg-white">
          <img
            src={logoImg}
            alt={BRAND_NAME}
            className={cn('h-36 w-36')}
            loading="lazy"
            aria-label={BRAND_NAME}
          />
        </div>

        {children}
      </div>
    </div>
  );
}
