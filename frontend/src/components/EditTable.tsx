import useItemStore from "@/store/useItemStore";
import Item from "./Item";

interface item {
    _id: string
    itemName: string
    buyPrice: number
    buyDate: number
    soldPrice?: number
    soldDate?: number
    imageUrl?: string
}

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
                    {items.map((item) => (
                        <Item item={item}/>
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