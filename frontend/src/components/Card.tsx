import React from 'react';
import { FiDollarSign, FiCreditCard, FiMonitor, FiBarChart2 } from "react-icons/fi";
import { tv } from 'tailwind-variants';

const card = tv({
  base: "w-72 bg-green-500 rounded-xl outline-2 outline-green-300 inline-flex flex-col items-center",
})

type IconType = 'dollar' | 'card' | 'monitor' | 'chart';

type CardProps = {
  icon: IconType;
  title: string;
  amount: string;
  subtitle: string;
}

const Card: React.FC<CardProps> = ({ icon, title, amount, subtitle }) => {
  const renderIcon = () => {
    switch (icon) {
      case 'dollar':
        return <FiDollarSign size={16} />;
      case 'card':
        return <FiCreditCard size={16} />;
      case 'monitor':
        return <FiMonitor size={16} />;
      case 'chart':
        return <FiBarChart2 size={16} />;
      default:
        return <FiDollarSign size={16} />;
    }
  };

  return (
    <div className={card()}>
        <div className="self-stretch px-6 pt-6 pb-2 inline-flex justify-between items-center text-midnight">
            <div className="w-64 flex justify-between items-center">
                <div className="text-base font-bold leading-tight">{title}</div>
                <div data-property-1={`${icon}`} className="relative">
                    {renderIcon()}
                </div>
            </div>
        </div>
        <div className="self-stretch px-6 pb-6 flex flex-col items-start">
            <div className="w-32 h-7 text-beige-100 text-2xl font-bold font-display2 leading-loose mb-1.5">{amount}</div>
            <div className="text-midnight text-xs font-medium leading-none">{subtitle}</div>
        </div>
    </div>
  )
}

export default Card;