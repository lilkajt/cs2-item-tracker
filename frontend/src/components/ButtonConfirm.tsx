import { ButtonHTMLAttributes } from "react";

const buttonStyles = "w-full h-12 bg-green-300 pb-1 text-beige-100 rounded-lg font-bold text-xl text-center cursor-pointer";
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;
function ButtonConfirm({children,className, onClick, ...props}: ButtonProps) {
  return (
    <button
    type="submit"
    className={`${buttonStyles} ${className || ''}`}
    {...props}
    onClick={onClick}
    >
    {children}
    </button>
  )
}

export default ButtonConfirm