import { LogoIcon } from './icons/logo-icon';

const Logo = () => {
  return (
    <div className="inline-flex gap-2 text-lg font-semibold text-primary">
      <LogoIcon className="h-7 w-7 text-primary" />
      WildLearn
    </div>
  );
};

export default Logo;
