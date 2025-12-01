enum ButtonType {
  SUBMIT = "submit",
  RESET = "reset",
  BUTTON = "button",
  DEFAULT = "button",
}

type ButtonProps = {
  handleClick: Function;
  title: string;
  type?: ButtonType;
  className: string;
};

export default function Button({
  handleClick,
  title,
  type,
  className,
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`p-2 px-4 border-2 shadow-[4px_4px_rgb(0,0,0)] hover:shadow-[3px_3px_rgb(0,0,0)] bg-amber-300 transition-all cursor-pointer rounded ${className}`}
      onClick={() => handleClick()}
    >
      {title}
    </button>
  );
}
