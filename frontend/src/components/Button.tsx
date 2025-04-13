import React from "react";
import { tv } from 'tailwind-variants';

const button = tv({
  base: 'w-24 h-10 px-4.5 rounded-5xl inline-flex items-center justify-center overflow-hidden cursor-pointer text-lg font-bold text-beige-100 hover:outline-2 hover:outline-offset-2',
  variants: {
    color: {
      green: 'bg-green-300 hover:bg-green-500 hover:outline-green-300',
      orange: 'bg-orange-200 hover:bg-orange-300 hover:outline-orange-200 text-base'
    },
  },
  defaultVariants:{
    color: 'green',
  }
});

type ButtonProps = {
  color?: 'green' | 'orange';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({color, children}) => {
  return (
    <div className={button({ color})} data-property-1={`${color} cta`}>
      {children}
    </div>
  );
};

export default Button;