import sprite from "../assets/images/icons/sprite.svg";

type IconProps = {
  name: string;
  className: string;
};

const Icon: React.FC<IconProps> = ({ name, className }) => {
  return (
    <svg className={"icon icon--" + className}>
      <use xlinkHref={`${sprite}#${name}`} />
    </svg>
  );
};

export default Icon;
