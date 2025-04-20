import useItemStore from "@/store/useItemStore";
import Item from "./Item";
import { useState , useEffect} from "react";
import { FiChevronLeft,FiChevronsLeft, FiChevronRight, FiChevronsRight} from "react-icons/fi";

function EditTable() {
    const {items, pagination, fetchItems} = useItemStore();
    const [currentPage, setCurrentPage] = useState(pagination.currentPage || 1);

    useEffect(()=> {
        fetchItems(currentPage);
    },[fetchItems, currentPage]);

    const handlePageChange = (page:number) => {
        setCurrentPage(page);
    };

    const handleDelete = () => {
        console.log('clicked delete');
    };

    const handleUpdate = () => {
        console.log('updated values');
    };

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
                <>
                    <div className="flex w-full flex-col px-table-1 pb-table-1 overflow-clip">
                        {items.map((item) => (
                            <Item item={item} key={item._id}/>
                        ))}
                    </div>
                    {/* pagination */}
                    <div className="flex flex-row w-full justify-center items-center">
                        <button
                        onClick={() => handlePageChange(1)}
                        disabled={!pagination.hasPrevPage}
                        className={`text-beige-100 flex items-center py-1 px-3 ${!pagination.hasPrevPage ? ("cursor-not-allowed text-midnight") : "cursor-pointer"}`}
                        >
                            <FiChevronsLeft size={64}/>
                        </button>
                        <button
                        onClick={() => handlePageChange(currentPage-1)}
                        disabled={!pagination.hasPrevPage}
                        className={`text-beige-100 flex items-center py-1 px-3 ${!pagination.hasPrevPage ? ("cursor-not-allowed text-midnight") : "cursor-pointer"}`}
                        >
                            <FiChevronLeft size={64}/>
                        </button>
                        <div className="flex text-beige-100 h-full text-5xl select-none">
                            <div>{currentPage}</div>
                        </div>
                        <button
                        onClick={() => handlePageChange(currentPage+1)}
                        disabled={!pagination.hasNextPage}
                        className={`text-beige-100 flex items-center py-1 px-3 ${!pagination.hasNextPage ? ("cursor-not-allowed text-midnight") : "cursor-pointer"}`}
                        >
                            <FiChevronRight size={64}/>
                        </button>
                        <button
                        onClick={() => handlePageChange(pagination.totalPages)}
                        disabled={!pagination.hasNextPage}
                        className={`text-beige-100 flex items-center py-1 px-3 ${!pagination.hasNextPage ? ("cursor-not-allowed text-midnight") : "cursor-pointer"}`}
                        >
                            <FiChevronsRight size={64}/>
                        </button>
                    </div>
                </>
            )}

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