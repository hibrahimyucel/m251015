import React from "react";
import { FC } from "react";

interface textButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
}
const TextButton: FC<textButtonProps> = ({
  text,
  ...props
}: textButtonProps) => {
  return (
    <button onClick={props.onClick} type={props.type} disabled={props.disabled}>
      {text}
    </button>
  );
};
export default TextButton;
