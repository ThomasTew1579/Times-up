type IconProps = {
  name: string;
  size?: number;
  className?: string;
};

function Icon({ name, size = 24, className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} aria-hidden="true">
      <use href={`sprite/far.svg#${name}`} />
    </svg>
  );
}

export default Icon;
