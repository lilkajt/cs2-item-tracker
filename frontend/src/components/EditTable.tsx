import useItemStore from "@/store/useItemStore";

{/* <div data-property-1="edit items" className="w-[1300px] h-96 bg-hover-over rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.06)] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.10)] outline outline-1 outline-offset-[-1px] outline-primary-CTA inline-flex flex-col justify-start items-start">
    <div className="self-stretch px-6 pt-6 pb-4 flex flex-col justify-center items-start">
        <div className="inline-flex justify-center items-center gap-2.5">
            <div className="justify-start text-bg text-lg font-bold font-['Satoshi'] leading-normal">Edit Items</div>
        </div>
    </div>
    <div className="self-stretch h-80 px-6 pb-6 inline-flex justify-end items-end">
        <div className="flex-1 h-80 inline-flex flex-col justify-start items-start">
            <div data-property-1="categories item full" className="self-stretch inline-flex justify-between items-center overflow-hidden">
                <div className="self-stretch flex justify-center items-center gap-2.5">
                    <div className="justify-start text-bg text-sm font-bold font-['Satoshi'] leading-tight">Image</div>
                </div>
                <div className="self-stretch flex justify-center items-center gap-2.5">
                    <div className="justify-start text-bg text-sm font-bold font-['Satoshi'] leading-tight">Item</div>
                </div>
                <div className="self-stretch pl-36 flex justify-center items-center gap-2.5">
                    <div className="justify-start text-bg text-sm font-bold font-['Satoshi'] leading-tight">Date buy</div>
                </div>
                <div className="self-stretch flex justify-center items-center gap-2.5">
                    <div className="justify-start text-bg text-sm font-bold font-['Satoshi'] leading-tight">Price buy</div>
                </div>
                <div className="self-stretch flex justify-center items-center gap-2.5">
                    <div className="justify-start text-bg text-sm font-bold font-['Satoshi'] leading-tight">Date sold</div>
                </div>
                <div className="self-stretch pr-2.5 flex justify-center items-center gap-2.5">
                    <div className="justify-start text-bg text-sm font-bold font-['Satoshi'] leading-tight">Price sold</div>
                </div>
                <div className="flex justify-center items-center gap-2.5">
                    <div className="justify-start text-bg text-sm font-bold font-['Satoshi'] leading-tight">Profit</div>
                </div>
            </div>
            <div data-property-1="item full" className="self-stretch h-9 inline-flex justify-start items-center gap-3.5">
                <div className="flex justify-start items-center">
                    <div data-property-1="image" className="w-6 h-6 relative">
                        <div className="w-5 h-5 left-[3.25px] top-[3.25px] absolute outline outline-2 outline-offset-[-1px] outline-text-beige" />
                    </div>
                </div>
                <div className="flex-1 py-[5px] flex justify-between items-center">
                    <div className="w-72 self-stretch py-[3px] flex justify-start items-center gap-2.5 overflow-hidden">
                        <div className="justify-start text-text-beige text-sm font-bold font-['Satoshi'] leading-tight">★ Skeleton Knife | Forest DDPAT (Field-Tested)</div>
                    </div>
                    <div className="w-20 self-stretch flex justify-end items-center gap-2.5">
                        <div className="justify-start text-text-beige text-sm font-bold font-['Satoshi'] leading-tight">02.03.2025</div>
                    </div>
                    <div className="w-14 self-stretch pt-[5px] flex justify-end items-center gap-2.5">
                        <div className="justify-center text-text-beige text-lg font-bold font-['GRIFTER'] leading-tight tracking-tight">  -100c</div>
                    </div>
                    <div className="w-20 self-stretch flex justify-end items-center gap-2.5">
                        <div className="justify-start text-text-beige text-sm font-bold font-['Satoshi'] leading-tight">01.04.2025</div>
                    </div>
                    <div className="w-14 self-stretch pt-[5px] flex justify-end items-center gap-2.5">
                        <div className="justify-center text-text-beige text-lg font-bold font-['GRIFTER'] leading-tight tracking-tight">+350c</div>
                    </div>
                    <div className="w-14 self-stretch pt-[5px] flex justify-end items-center gap-2.5">
                        <div className="justify-center text-text-beige text-lg font-bold font-['GRIFTER'] leading-tight tracking-tight">+0c</div>
                    </div>
                </div>
            </div>
            <div data-property-1="item n element full" className="self-stretch h-14 pt-5 flex flex-col justify-start items-start gap-2.5">
                <div data-property-1="item full" className="self-stretch flex-1 inline-flex justify-start items-center gap-3.5">
                    <div className="flex justify-start items-center">
                        <div data-property-1="image" className="w-6 h-6 relative">
                            <div className="w-5 h-5 left-[3.25px] top-[3.25px] absolute outline outline-2 outline-offset-[-1px] outline-text-beige" />
                        </div>
                    </div>
                    <div className="flex-1 py-[5px] flex justify-between items-center">
                        <div className="w-72 self-stretch py-[3px] flex justify-start items-center gap-2.5 overflow-hidden">
                            <div className="justify-start text-text-beige text-sm font-bold font-['Satoshi'] leading-tight">★ Kukri Knife | Crimson Web (Field-Tested)</div>
                        </div>
                        <div className="w-20 self-stretch flex justify-end items-center gap-2.5">
                            <div className="justify-start text-text-beige text-sm font-bold font-['Satoshi'] leading-tight">02.03.2025</div>
                        </div>
                        <div className="w-14 self-stretch pt-[5px] flex justify-end items-center gap-2.5">
                            <div className="justify-center text-text-beige text-lg font-bold font-['GRIFTER'] leading-tight tracking-tight">  -100c</div>
                        </div>
                        <div className="w-20 self-stretch flex justify-end items-center gap-2.5">
                            <div className="justify-start text-text-beige text-sm font-bold font-['Satoshi'] leading-tight">01.04.2025</div>
                        </div>
                        <div className="w-14 self-stretch pt-[5px] flex justify-end items-center gap-2.5">
                            <div className="justify-center text-text-beige text-lg font-bold font-['GRIFTER'] leading-tight tracking-tight">+205c</div>
                        </div>
                        <div className="w-14 self-stretch pt-[5px] flex justify-end items-center gap-2.5">
                            <div className="justify-center text-text-beige text-lg font-bold font-['GRIFTER'] leading-tight tracking-tight">+0c</div>
                        </div>
                    </div>
                </div>
            </div>
            <div data-property-1="item n element full" className="self-stretch h-14 pt-5 flex flex-col justify-start items-start gap-2.5">
                <div data-property-1="item full" className="self-stretch flex-1 inline-flex justify-start items-center gap-3.5">
                    <div className="flex justify-start items-center">
                        <div data-property-1="image" className="w-6 h-6 relative">
                            <div className="w-5 h-5 left-[3.25px] top-[3.25px] absolute outline outline-2 outline-offset-[-1px] outline-text-beige" />
                        </div>
                    </div>
                    <div className="flex-1 py-[5px] flex justify-between items-center">
                        <div className="w-72 self-stretch py-[3px] flex justify-start items-center gap-2.5 overflow-hidden">
                            <div className="justify-start text-text-beige text-sm font-bold font-['Satoshi'] leading-tight">★ Kukri Knife | Crimson Web (Field-Tested)</div>
                        </div>
                        <div className="w-20 self-stretch flex justify-end items-center gap-2.5">
                            <div className="justify-start text-text-beige text-sm font-bold font-['Satoshi'] leading-tight">02.03.2025</div>
                        </div>
                        <div className="w-14 self-stretch pt-[5px] flex justify-end items-center gap-2.5">
                            <div className="justify-center text-text-beige text-lg font-bold font-['GRIFTER'] leading-tight tracking-tight">  -100c</div>
                        </div>
                        <div className="w-20 self-stretch flex justify-end items-center gap-2.5">
                            <div className="justify-start text-text-beige text-sm font-bold font-['Satoshi'] leading-tight">01.04.2025</div>
                        </div>
                        <div className="w-14 self-stretch pt-[5px] flex justify-end items-center gap-2.5">
                            <div className="justify-center text-text-beige text-lg font-bold font-['GRIFTER'] leading-tight tracking-tight">+205c</div>
                        </div>
                        <div className="w-14 self-stretch pt-[5px] flex justify-end items-center gap-2.5">
                            <div className="justify-center text-text-beige text-lg font-bold font-['GRIFTER'] leading-tight tracking-tight">+0c</div>
                        </div>
                    </div>
                </div>
            </div>
            <div data-property-1="item n element full" className="self-stretch h-14 pt-5 flex flex-col justify-start items-start gap-2.5">
                <div data-property-1="item full" className="self-stretch flex-1 inline-flex justify-start items-center gap-3.5">
                    <div className="flex justify-start items-center">
                        <div data-property-1="image" className="w-6 h-6 relative">
                            <div className="w-5 h-5 left-[3.25px] top-[3.25px] absolute outline outline-2 outline-offset-[-1px] outline-text-beige" />
                        </div>
                    </div>
                    <div className="flex-1 py-[5px] flex justify-between items-center">
                        <div className="w-72 self-stretch py-[3px] flex justify-start items-center gap-2.5 overflow-hidden">
                            <div className="justify-start text-text-beige text-sm font-bold font-['Satoshi'] leading-tight">★ Kukri Knife | Crimson Web (Field-Tested)</div>
                        </div>
                        <div className="w-20 self-stretch flex justify-end items-center gap-2.5">
                            <div className="justify-start text-text-beige text-sm font-bold font-['Satoshi'] leading-tight">02.03.2025</div>
                        </div>
                        <div className="w-14 self-stretch pt-[5px] flex justify-end items-center gap-2.5">
                            <div className="justify-center text-text-beige text-lg font-bold font-['GRIFTER'] leading-tight tracking-tight">  -100c</div>
                        </div>
                        <div className="w-20 self-stretch flex justify-end items-center gap-2.5">
                            <div className="justify-start text-text-beige text-sm font-bold font-['Satoshi'] leading-tight">01.04.2025</div>
                        </div>
                        <div className="w-14 self-stretch pt-[5px] flex justify-end items-center gap-2.5">
                            <div className="justify-center text-text-beige text-lg font-bold font-['GRIFTER'] leading-tight tracking-tight">+205c</div>
                        </div>
                        <div className="w-14 self-stretch pt-[5px] flex justify-end items-center gap-2.5">
                            <div className="justify-center text-text-beige text-lg font-bold font-['GRIFTER'] leading-tight tracking-tight">+0c</div>
                        </div>
                    </div>
                </div>
            </div>
            <div data-property-1="item n element full" className="self-stretch h-14 pt-5 flex flex-col justify-start items-start gap-2.5">
                <div data-property-1="item full" className="self-stretch flex-1 inline-flex justify-start items-center gap-3.5">
                    <div className="flex justify-start items-center">
                        <div data-property-1="image" className="w-6 h-6 relative">
                            <div className="w-5 h-5 left-[3.25px] top-[3.25px] absolute outline outline-2 outline-offset-[-1px] outline-text-beige" />
                        </div>
                    </div>
                    <div className="flex-1 py-[5px] flex justify-between items-center">
                        <div className="w-72 self-stretch py-[3px] flex justify-start items-center gap-2.5 overflow-hidden">
                            <div className="justify-start text-text-beige text-sm font-bold font-['Satoshi'] leading-tight">★ Kukri Knife | Crimson Web (Field-Tested)</div>
                        </div>
                        <div className="w-20 self-stretch flex justify-end items-center gap-2.5">
                            <div className="justify-start text-text-beige text-sm font-bold font-['Satoshi'] leading-tight">02.03.2025</div>
                        </div>
                        <div className="w-14 self-stretch pt-[5px] flex justify-end items-center gap-2.5">
                            <div className="justify-center text-text-beige text-lg font-bold font-['GRIFTER'] leading-tight tracking-tight">  -100c</div>
                        </div>
                        <div className="w-20 self-stretch flex justify-end items-center gap-2.5">
                            <div className="justify-start text-text-beige text-sm font-bold font-['Satoshi'] leading-tight">01.04.2025</div>
                        </div>
                        <div className="w-14 self-stretch pt-[5px] flex justify-end items-center gap-2.5">
                            <div className="justify-center text-text-beige text-lg font-bold font-['GRIFTER'] leading-tight tracking-tight">+205c</div>
                        </div>
                        <div className="w-14 self-stretch pt-[5px] flex justify-end items-center gap-2.5">
                            <div className="justify-center text-text-beige text-lg font-bold font-['GRIFTER'] leading-tight tracking-tight">+0c</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div> */}


function EditTable() {
    const {items} = useItemStore();
    console.log(items);
  return (
    <>
        <div className="bg-green-500 outline-2 outline-green-300 text-midnight h-92 w-100 rounded-2xl">
            <div className="h-fit w-full flex justify-start">
                <div className="w-full h-fit px-table-1 pt-table-1 pb-table-2 font-bold text-lg leading-normal">
                    <div>
                        Edit Items
                    </div>
                </div>
            </div>
            {/* kategorie - grid -> tutaj nasluchujemy zmian w item oraz odswiezamy dane */}
            {/* component item -> display items with pagination */}
        </div>
    </>
  )
}
export default EditTable;