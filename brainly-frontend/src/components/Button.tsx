import type { ReactElement } from "react";

interface ButtonProps {
  varient: "primary" | "secondary";
  text: string;
  startIcon?: ReactElement;
}

const variendtClass = {
  primary: "bg-purple-600 text-white",
  secondary: "bg-purple-200 text-purple-600",
};

const defaultStyle = "px-2 py-2 rounded-md font-light flex items-center";

export function Button({ varient, text, startIcon }: ButtonProps) {
  return (
    <button className={variendtClass[varient] + " " + defaultStyle}>
      <div className="pr-2">
        {startIcon}
      </div>
      {text}
    </button>
  );
}
