import { twMerge } from "tailwind-merge";

export interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
  type?: "submit" | "button";
  className?: string;
  buttonSize?: "small" | "medium" | "large";
  disabled?: boolean;
  buttonStyle?: "success" | "secondary" | "error" | "default";
}

const buttonStyleFactory = (color: string, text = "white") => `
text-${text}
bg-${color}-500
hover:bg-${color}-600
focus:bg-${color}-400
active:bg-${color}-700
disabled:bg-gray-400`;

const successStyle = buttonStyleFactory("green");
const secondaryStyle = buttonStyleFactory("yellow");
const errorStyle = buttonStyleFactory("red");
const defaultStyle = buttonStyleFactory("blue");

const getStyle = (style: ButtonProps["buttonStyle"]) => {
  switch (style) {
    case "success":
      return successStyle;
    case "secondary":
      return secondaryStyle;
    case "error":
      return errorStyle;
    default:
      return defaultStyle;
  }
};

const largeStyle = `px-4 py-2 text-lg`;
const mediumStyle = `px-3 py-2 text-md`;
const smallStyle = `px-1 py-1 text-sm`;
const getSizeStyle = (size: ButtonProps["buttonSize"]) => {
  switch (size) {
    case "small":
      return smallStyle;
    case "medium":
      return mediumStyle;
    case "large":
      return largeStyle;
    default:
      return mediumStyle;
  }
};

export const Button = ({
  children,
  className,
  disabled,
  buttonSize,
  buttonStyle,
  type = "button",
  name,
  value,
  onClick,
}: ButtonProps) => {
  const classes = twMerge(`rounded ${getStyle(buttonStyle)} ${getSizeStyle(buttonSize)}`, className);
  return (
    <button
      name={name}
      value={value}
      disabled={disabled}
      className={classes}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

/**
 * <button
            type="submit"
            disabled={!allowSubmission}
            className="
              px-3 py-1 rounded
              bg-blue-500 text-white
              hover:bg-blue-600
              focus:bg-blue-400
              active:bg-blue-700
              disabled:bg-gray-400
              "
          >
            Submit
          </button>
 */
