import React from 'react'
import { tv } from 'tailwind-variants'

const title = tv({
  base: "font-display2 text-center text-4xl",
  variants: {
    color: {
      green: 'text-green-300',
      beige: 'text-beige-100'
    },
  },
  defaultVariants:{
    color: 'beige'
  }
});

type TitleProps = {
  color?: 'green' | 'beige';
  children: React.ReactNode;
}

const Title: React.FC<TitleProps> = ({color, children}) => {
  return (
    <div className={title({color})} data-property-1={`${color} title`}>
      {children}
    </div>
  )
}

export default Title;