import { InputHTMLAttributes } from 'react'

const inputStyles = 'placeholder:text-beige-200 outline-2 w-72 h-12 px-2.5 rounded-lg outline-green-300 overflow-hidden text-beige-100 text-xl leading-14 focus:outline-blue focus:text-beige-100';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

function Input({placeholder, className, ...props}: InputProps) {
  return (
    <input
        type='text'
        placeholder={placeholder}
        className={`${inputStyles} ${className || ''}`}
        {...props}
    />
  )
}

export default Input;