import payOSLogo from '@assets/logo/payos.png';
import { OrbitingCircles } from '@shared/components/extensions/orbit-circle';
import { BANKS } from '@shared/constants/bank.constant';

const getRandomBanks = (count: number) => {
  const shuffled = [...BANKS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export function PaymentOrbit() {
  const innerBanks = getRandomBanks(4);
  const middleBanks = getRandomBanks(6);
  const outerBanks = getRandomBanks(8);

  return (
    <div className="absolute flex h-[300px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background [--duration:20s] [mask-image:linear-gradient(to_top,transparent_1%,#000_100%)] md:shadow-xl">
      <img
        className="pointer-events-none w-36 whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300 bg-clip-text text-center font-semibold text-8xl text-transparent leading-none dark:from-white dark:to-black"
        src={payOSLogo}
        alt="PayOS Logo"
      />

      {/* Inner Circle */}
      {innerBanks.map((bank, index) => (
        <OrbitingCircles
          key={bank.id}
          className="size-[8rem] border-none bg-transparent"
          duration={25}
          delay={index * 6}
          radius={100}
        >
          <img
            className="h-25 object-contain"
            src={bank.logo}
            alt={bank.shortName}
          />
        </OrbitingCircles>
      ))}

      {/* Middle Circle */}
      {middleBanks.map((bank, index) => (
        <OrbitingCircles
          key={bank.id}
          className="size-[7rem] border-none bg-transparent"
          duration={30}
          delay={index * 5}
          radius={160}
        >
          <img
            className="h-20 object-contain"
            src={bank.logo}
            alt={bank.shortName}
          />
        </OrbitingCircles>
      ))}

      {/* Outer Circle */}
      {outerBanks.map((bank, index) => (
        <OrbitingCircles
          key={bank.id}
          className="size-[6rem] border-none bg-transparent"
          duration={35}
          delay={index * 4}
          radius={220}
          reverse
        >
          <img
            className="h-16 object-contain"
            src={bank.logo}
            alt={bank.shortName}
          />
        </OrbitingCircles>
      ))}
    </div>
  );
}
