import { FiImage } from "react-icons/fi";
import { round10 } from "@/utils/decimalAdjust";
import { Item } from "@/store/useItemStore";

interface TableProps {
  items: Item[];
  title?: string;
}

function Table({ items, title = "Recent Sales" }: TableProps) {
  return (
    <div data-property-1="sales" className="w-full max-w-[535px] bg-green-500 rounded-xl outline-2 outline-green-300 flex flex-col justify-start items-start overflow-hidden">
        <div className="self-stretch px-4 sm:px-6 pt-4 sm:pt-6 pb-2 sm:pb-4 flex flex-col justify-center items-start">
            <div className="flex justify-center items-center">
                <div className="text-midnight text-base sm:text-lg font-bold leading-normal">{title}</div>
            </div>
        </div>
        <div className="self-stretch w-full px-4 sm:px-6 pb-4 sm:pb-6 flex-1 overflow-y-auto">
            <div className="flex-1 self-stretch flex flex-col justify-start items-start w-full">
                <div data-property-1="categories" className="w-full relative overflow-hidden py-1 mb-2 text-midnight text-center leading-tight text-xs sm:text-sm font-bold">
                    <div className="grid grid-cols-12 w-full gap-2">
                        <div className="col-span-1">
                            Image
                        </div>
                        <div className="col-span-6 sm:col-span-7">
                            Item
                        </div>
                        <div className="col-span-3 sm:col-span-2">
                            Date
                        </div>
                        <div className="col-span-2">
                            Income
                        </div>
                    </div>
                </div>
                
                { items.length > 0 && items.map((item, index) => (
                    <div 
                        key={item._id || index} 
                        data-property-1="item" 
                        className={`w-full h-9 inline-flex justify-start items-center ${
                            index > 0 ? 'mt-4 sm:mt-6' : ''
                        }`}
                    >
                        <div className="grid grid-cols-12 w-full gap-2 items-center">
                            <div className="col-span-1 flex justify-start items-center">
                                {item.imageUrl ? (
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 relative overflow-hidden">
                                        <img 
                                            src={item.imageUrl} 
                                            alt={item.itemName}
                                            className="w-5 h-5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 object-contain"
                                        />
                                    </div>
                                ) : (
                                    <div data-property-1="image" className="w-5 h-5 sm:w-6 sm:h-6 relative text-beige-100">
                                        <FiImage size={20} />
                                    </div>
                                )}
                            </div>
                            <div className="col-span-6 sm:col-span-7 overflow-hidden">
                                <div className="text-beige-100 text-sm font-medium leading-tight truncate text-center" title={item.itemName}>
                                    {item.itemName}
                                </div>
                            </div>
                            <div className="col-span-3 sm:col-span-2 text-right">
                                <div className="text-beige-100 text-xs sm:text-sm font-medium leading-tight text-center">
                                    {item.soldDate ? (new Date(item.soldDate).toLocaleDateString()) : ('not sold yet')}
                                </div>
                            </div>
                            <div className="col-span-2 text-right">
                                <div className="text-beige-100 text-lg font-bold font-display2 leading-tight tracking-tight text-center">
                                    { item.soldPrice? (item.soldPrice - item.buyPrice > 0 ? `+${round10(item.soldPrice - item.buyPrice,-2)}`: round10(item.soldPrice - item.buyPrice,-2)): round10(0 - item.buyPrice,-2)}c
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                
                {items.length === 0 && (
                    <div className="w-full py-4 text-center text-beige-100 text-2xl font-medium">
                        No recent sales
                    </div>
                )}
            </div>
        </div>
    </div>
  );
}

export default Table;