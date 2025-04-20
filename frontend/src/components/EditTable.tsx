import useItemStore from "@/store/useItemStore";

// test -> potem usunac
interface Item {
    _id: string
    itemName: string
    buyPrice: number
    buyDate: number
    soldPrice?: number
    soldDate?: number
    imageUrl?: string
}

// usunac interface bo on bedzie uzywany tylko w item tutaj bedziemy wywolywac items z useitemstore
// tutaj bedzie logika update i delete przedmiotu () => update/delete
// jesli nie ma danych to wyswietlic "No items"
function EditTable() {
    const {items} = useItemStore();
    for (const element of items) {
        console.log(element);
    }
  return (
    <>
        <div className="bg-green-500 outline-2 outline-green-300 text-midnight rounded-2xl">
            <div className="h-fit w-full flex justify-start">
                <div className="w-full h-fit px-table-1 pt-table-1 pb-table-2 font-bold text-lg leading-normal">
                    <div>
                        Edit Items
                    </div>
                </div>
            </div>
            {/* adjust columns if above sm turn into table */}
            { items.length > 0 && (
                <div className="flex w-full flex-col px-table-1 pb-table-1 overflow-clip">
                    {items.map((item,index) => (
                        <div className="grid grid-flow-row grid-cols-2 text-midnight gap-4 text-xl border-2 border-green-300 rounded-2xl pb-table-1">
                            <div className="flex justify-start items-center">image</div><div className="text-beige-100">https:/wfawfwf</div>
                            <div className="flex justify-start items-center">item</div><div>FAMAS | Roll Cage (Field-Tested)</div>
                            <div>date buy</div><div>1710374400000</div>
                            <div>price buy</div><div>100</div>
                            <div>date sold</div><div>1710374400000</div>
                            <div>price sold</div><div>110</div>
                            <div>profit</div><div>10</div>
                            <div>delete</div><div>icon delete</div>
                        </div>
                    ))}
                </div>
            )}
            {/* // component item -> display items with pagination */}

            { items.length === 0 &&(
                <div className="flex w-full px-table-1 pb-table-1 text-beige-100 justify-center items-center text-3xl">
                    <div>No items</div>
                </div>
            )}
        </div>
    </>
  )
}
export default EditTable;