import { cn } from '@app/lib/utils';

import logoImg from '@assets/images/logo.png';
import registerBg from '@assets/images/register_bg.png';
import { BRAND_NAME } from '@shared/constants/general.constant';

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative">
      <img
        src={registerBg}
        alt="BG-Side of Register Page"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
        aria-label="Register Page Background"
      />
      <div className="relative z-10 bg-white shadow-2xl rounded-lg p-10 max-w-3xl w-full md:w-[600px]">
        {/* title register */}
        <div className="flex items-center gap-2 justify-center mb-2 md:-mt-24">
          <img
            src={logoImg}
            alt={BRAND_NAME}
            className={cn('w-28 h-28', 'rounded-full')}
            loading="lazy"
            aria-label={BRAND_NAME}
          />
        </div>

        {children}
      </div>
    </div>
  );
}
