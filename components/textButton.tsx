import React from "react";
import { FC } from "react";

interface textButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string | null;
}
const TextButton: FC<textButtonProps> = ({
  text,
  ...props
}: textButtonProps) => {
  return (
    <button
      onClick={props.onClick}
      type={props.type}
      disabled={props.disabled}
      className="min-h-5 min-w-25 cursor-pointer p-2 text-nowrap"
    >
      {text}
    </button>
  );
};
export default TextButton;
