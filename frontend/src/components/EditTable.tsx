import useItemStore, { SortField } from "@/store/useItemStore";
import { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronsLeft, FiChevronRight, FiChevronsRight, FiChevronUp, FiChevronDown } from "react-icons/fi";
import { Item } from "@/store/useItemStore";
import { toast } from 'sonner';
import ModalItem from "./ModalItem";
import Input from "./Input";
import ButtonConfirm from "./ButtonConfirm";
import { DatePicker } from "./DatePicker";
import { FiImage, FiX } from "react-icons/fi";
import { round10 } from "@/utils/decimalAdjust";

const itemRegex = /^[a-zA-Z0-9! |★壱()-™]+$/;
const priceRegex = /^-?\d+(\.\d{1,2})?$/;
const itemUrlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;

function EditTable() {
    const {
        displayItems, 
        pagination,
        deleteItem,
        updateItem,
        serverResponse, 
        clearServerResponse,
        loadingItems,
        sortField,
        sortDirection,
        setSorting,
        setPage
    } = useItemStore();
    
    const [processing, setIsProcessing] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [editedItem, setEditedItem] = useState<Partial<Item>>({});
    const [errors, setErrors] = useState({
        imageUrl: '',
        itemName: '',
        buyPrice: '',
        buyDate: '',
        soldPrice: '',
        soldDate: ''
    });
    type ErrorKey = keyof typeof errors;


    useEffect(() => {
        if (serverResponse) {
            if (serverResponse.success) {
                toast.success(serverResponse.message);
            } else {
                toast.error(serverResponse.message);
            }

            const timer = setTimeout(() => {
                clearServerResponse();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [serverResponse, clearServerResponse]);

    const handlePageChange = (page: number) => {
        setPage(page);
    };

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSorting(field, sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSorting(field, 'desc');
        }
    };

    const openEditModal = (item: Item) => {
        setSelectedItem(item);
        setEditedItem({
            imageUrl: item.imageUrl || '',
            itemName: item.itemName,
            buyPrice: item.buyPrice,
            buyDate: item.buyDate,
            soldPrice: item.soldPrice || 0,
            soldDate: item.soldDate || undefined
        });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedItem(null);
        setEditedItem({});
        setErrors({
            imageUrl: '',
            itemName: '',
            buyPrice: '',
            buyDate: '',
            soldPrice: '',
            soldDate: ''
        });
    };

    const handleDelete = async (id: string) => {
        setIsProcessing(true);
        await deleteItem(id);
        setIsProcessing(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
    
        setEditedItem(prev => ({
            ...prev,
            [name]: value
        }));
    
        if (errors[name as ErrorKey]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };
    
    const handleBuyDateChange = (date: Date | undefined) => {
        setEditedItem(prev => ({
            ...prev,
            buyDate: date ? date.getTime() : Date.now()
        }));
      
        if (errors.buyDate) {
            setErrors(prev => ({
                ...prev,
                buyDate: ''
            }));
        }
    };
    
    const handleSoldDateChange = (date: Date | undefined) => {
        setEditedItem(prev => ({
            ...prev,
            soldDate: date ? date.getTime() : undefined
        }));
      
        if (errors.soldDate) {
            setErrors(prev => ({
                ...prev,
                soldDate: ''
            }));
        }
    };
    
    const validateData = (data: Partial<Item>) => {
        const errors = {
            imageUrl: '',
            itemName: '',
            buyPrice: '',
            buyDate: '',
            soldPrice: '',
            soldDate: ''
        };
        let isValid = true;
        
        if (!data.itemName || data.itemName.trim() === '') {
            errors.itemName = 'Item name is required';
            isValid = false;
        } else if (!itemRegex.test(data.itemName)) {
            errors.itemName = 'Item name contains invalid characters';
            isValid = false;
        }
    
        if (!data.buyDate){
            errors.buyDate = "Buy date must be valid."
            isValid = false;
        }
        
        if (data.buyPrice === undefined || data.buyPrice === null || data.buyPrice < 0) {
            errors.buyPrice = 'Buy price must be 0 or greater';
            isValid = false;
        } else if (!priceRegex.test(String(data.buyPrice))) {
            errors.buyPrice = 'Buy price must be a valid number with up to 2 decimal places';
            isValid = false;
        }
        
        if (data.imageUrl && data.imageUrl.trim() !== '' && !itemUrlRegex.test(data.imageUrl)) {
            errors.imageUrl = 'Please enter a valid image URL';
            isValid = false;
        }
    
        if (data.soldDate && (!data.soldPrice || Number(data.soldPrice) === 0)) {
            data.soldPrice = 0;
        }
    
        if (data.soldPrice && Number(data.soldPrice) > 0 && !data.soldDate) {
            data.soldDate = Date.now();
        }
        
        if (data.soldPrice !== undefined && data.soldPrice !== null && String(data.soldPrice) !== '') {
            if (Number(data.soldPrice) < 0) {
                errors.soldPrice = 'Sold price must be 0 or greater';
                isValid = false;
            } else if (!priceRegex.test(String(data.soldPrice))) {
                errors.soldPrice = 'Sold price must be a valid number with up to 2 decimal places';
                isValid = false;
            }
        }
        
        if (data.buyDate && data.soldDate && data.buyDate > data.soldDate) {
            errors.soldDate = 'Sold date must be after buy date';
            isValid = false;
        }
    
        setErrors(errors);
        return isValid;
    };
    
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedItem) return;
        
        if (validateData(editedItem)) {
            setIsProcessing(true);
            await updateItem(selectedItem._id, editedItem);
            closeModal();
            setIsProcessing(false);
        }
    };

    const renderSortIcon = (field: SortField) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc' ? 
            <FiChevronUp className="inline ml-1" /> : 
            <FiChevronDown className="inline ml-1" />;
    };

    return (
        <>
            <div className="bg-green-500 outline-2 outline-green-300 text-midnight rounded-2xl xl:min-w-[1275px] max-w-[800px]">
                <div className="h-fit w-full flex justify-start">
                    <div className="w-full h-fit px-table-1 pt-table-1 pb-table-2 font-bold text-lg leading-normal">
                        <div className="flex justify-between items-center text-3xl">
                            <div>Edit Items</div>
                            {sortField && (
                                <div className="text-sm">
                                    Sorted by: {sortField} ({sortDirection})
                                </div>
                            )}
                        </div>
                        {processing || loadingItems && (
                            <div className="text-beige-100">
                                { processing ? "Processing..." : "Loading items..."}
                            </div>
                        )}
                    </div>
                </div>
                
                {displayItems.length > 0 && (
                    <>
                        <div className="flex w-full flex-col px-table-1 pb-table-1 overflow-clip">
                            {/* Table header with sortable columns */}
                            <div className="grid grid-flow-col text-beige-100 gap-4 text-xl pb-table-2 font-bold border-b border-midnight">
                                <div className="flex justify-start items-center text-midnight">Sort by:</div>
                                <div
                                    className="flex justify-start items-center cursor-pointer hover:text-green-100"
                                    onClick={() => handleSort('buyDate')}
                                >
                                    date buy {renderSortIcon('buyDate')}
                                </div>
                                <div 
                                    className="flex justify-start items-center cursor-pointer hover:text-green-100"
                                    onClick={() => handleSort('buyPrice')}
                                >
                                    price buy {renderSortIcon('buyPrice')}
                                </div>
                                <div 
                                    className="flex justify-start items-center cursor-pointer hover:text-green-100"
                                    onClick={() => handleSort('soldDate')}
                                >
                                    date sold {renderSortIcon('soldDate')}
                                </div>
                                <div 
                                    className="flex justify-start items-center cursor-pointer hover:text-green-100"
                                    onClick={() => handleSort('soldPrice')}
                                >
                                    price sold {renderSortIcon('soldPrice')}
                                </div>
                                <div 
                                    className="flex justify-start items-center cursor-pointer hover:text-green-100"
                                    onClick={() => handleSort('profit')}
                                >
                                    profit {renderSortIcon('profit')}
                                </div>
                            </div>
                            
                            {/* Table content */}
                            {displayItems.map((item) => (
                                <div
                                    key={item._id}
                                    data-property="item"
                                    className="grid grid-flow-row grid-cols-2 text-midnight gap-4 text-xl py-table-2 border-b border-midnight/20"
                                >
                                    <div className="flex justify-start items-center">image</div>
                                    {item.imageUrl ? (
                                        <div className="overflow-hidden flex justify-center items-center">
                                            <img className="w-32" src={item.imageUrl} alt={item.itemName} />
                                        </div>
                                    ) : (
                                        <div className="text-beige-100 flex justify-center">
                                            <FiImage size={64}/>
                                        </div>
                                    )}
                                    <div className="flex justify-start items-center">item</div><div className="text-beige-100">{item.itemName}</div>
                                    <div className="flex justify-start items-center">date buy</div><div className="text-beige-100">{ new Date(item.buyDate).toLocaleDateString('en-GB')}</div>
                                    <div className="flex justify-start items-center">price buy</div><div className="text-beige-100 font-display2">{item.buyPrice}</div>
                                    <div className="flex justify-start items-center">date sold</div><div className="text-beige-100">{item.soldDate ? ( new Date(item.soldDate).toLocaleDateString('en-GB')): 'not sold'}</div>
                                    <div className="flex justify-start items-center">price sold</div><div className={`text-beige-100 ${ item.soldPrice !== null ? "font-display2": ""}`}>{item.soldPrice !== null ? item.soldPrice: 'not sold'}</div>
                                    <div className="flex justify-start items-center">profit</div><div className={`text-beige-100 ${ item.soldPrice !== null ? "font-display2": ""}`}>{ item.soldPrice !== null ? (item.soldPrice - item.buyPrice > 0 ? `+${round10(item.soldPrice - item.buyPrice,-2)}`: round10(item.soldPrice - item.buyPrice,-2)): "not sold"}</div>
                                    <div className="flex justify-center">
                                        <div className="flex xl:w-[400px] w-full items-center justify-center bg-midnight rounded-2xl mr-3 my-3 cursor-pointer" onClick={() => openEditModal(item)}>
                                            <div className="py-3 px-3 text-beige-100">Edit</div>
                                        </div>
                                    </div>
                                    <div className="flex justify-center">
                                        <div className="flex xl:w-[400px] w-full items-center justify-center bg-midnight rounded-2xl ml-3 my-3 cursor-pointer" onClick={() => handleDelete(item._id)}>
                                            <div className="py-3 px-3 text-red">Delete</div>
                                        </div>
                                    </div>
                                </div>
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
                                onClick={() => handlePageChange(pagination.currentPage-1)}
                                disabled={!pagination.hasPrevPage}
                                className={`text-beige-100 flex items-center py-1 px-3 ${!pagination.hasPrevPage ? ("cursor-not-allowed text-midnight") : "cursor-pointer"}`}
                            >
                                <FiChevronLeft size={64}/>
                            </button>
                            <div className="flex text-beige-100 h-full text-5xl select-none">
                                <div>{pagination.currentPage}</div>
                            </div>
                            <button
                                onClick={() => handlePageChange(pagination.currentPage+1)}
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

                {displayItems.length === 0 && (
                    <div className="flex w-full px-table-1 pb-table-1 text-beige-100 justify-center items-center text-3xl">
                        <div>No items</div>
                    </div>
                )}
            </div>
            
            <ModalItem open={modalOpen} onClose={closeModal}>
                {/* Modal content */}
                <div className="grid grid-flow-row grid-cols-2 justify-center items-center mx-5 my-25 gap-9">
                    <div className="col-span-2">
                        <div className="flex flex-col justify-center items-center mb-5">
                            <Input
                                placeholder="Choose item or write"
                                className={`font-bold sm:text-2xl ${errors.itemName ? "outline-red text-red" : ""}`}
                                value={editedItem.itemName || ''}
                                onChange={handleInputChange}
                                name="itemName"
                            />
                            <div className="text-beige-100 leading-15">Search for item you would like to add or write your own.</div>
                            {errors.itemName ? (
                                <div className="text-red text-2xl w-72">{errors.itemName}</div>
                            ) : ""}
                        </div>
                        <div className="flex col-span-2 flex-col justify-center items-center mb-5">
                            <Input
                                placeholder="Write buy price"
                                className={`font-bold sm:text-2xl ${errors.buyPrice ? "outline-red text-red" : ""}`}
                                value={editedItem.buyPrice || 0}
                                onChange={handleInputChange}
                                name="buyPrice"
                                type="number"
                            />
                            <div className="text-beige-100 leading-15">Enter price you bought item for.</div>
                            {errors.buyPrice ? (
                                <div className="text-red text-2xl w-72">{errors.buyPrice}</div>
                            ) : ""}
                        </div>
                        <div className="flex col-span-2 flex-col justify-center items-center mb-5">
                            <DatePicker
                                date={editedItem.buyDate ? new Date(editedItem.buyDate) : undefined}
                                onSelect={handleBuyDateChange}
                                placeholder="Enter item buy date"
                                className={`${errors.buyDate ? "outline-red text-red" : ""}`}
                            />
                            <div className="text-beige-100 leading-15">Pick date you bought item.</div>
                            {errors.buyDate ? (
                                <div className="text-red text-2xl w-72">{errors.buyDate}</div>
                            ) : ""}
                        </div>
                    </div>
                    <div className="col-span-2">
                        <div className="flex flex-col justify-center items-center mb-5">
                            <Input
                                placeholder="Enter item sold price"
                                className={`font-bold sm:text-2xl ${errors.soldPrice ? "outline-red text-red" : ""}`}
                                value={editedItem.soldPrice || ""}
                                onChange={handleInputChange}
                                name="soldPrice"
                                type="number"
                            />
                            <div className="text-beige-100 leading-15">Enter price you sold item for.
                                If not sold yet, leave.</div>
                            {errors.soldPrice ? (
                                <div className="text-red text-2xl w-72">{errors.soldPrice}</div>
                            ) : ""}
                        </div>
                        <div className="flex flex-col justify-center items-center mb-5">
                            <DatePicker
                                date={editedItem.soldDate ? new Date(editedItem.soldDate) : undefined}
                                onSelect={handleSoldDateChange}
                                placeholder="Enter item sold date"
                                className={`${errors.soldDate ? "outline-red text-red" : ""}`}
                            />
                            <div className="text-beige-100 leading-15">Pick date you sold item
                                If not sold yet, leave.</div>
                            {errors.soldDate ? (
                                <div className="text-red text-2xl w-72">{errors.soldDate}</div>
                            ) : ""}
                        </div>
                        <div className="flex col-span-2 flex-col justify-center items-center mb-5">
                            <Input
                                placeholder="write image url"
                                className={`font-bold sm:text-2xl ${errors.imageUrl ? "outline-red text-red" : ""}`}
                                value={editedItem.imageUrl || ''}
                                onChange={handleInputChange}
                                name="imageUrl"
                            />
                            <div className="text-beige-100 leading-15">Write image url.</div>
                            {errors.imageUrl ? (
                                <div className="text-red text-2xl w-72">{errors.imageUrl}</div>
                            ) : ""}
                        </div>
                    </div>
                    <div className="col-span-2 flex flex-row justify-center items-center mb-5 gap-5 sm:mx-20">
                        <ButtonConfirm
                        onClick={handleSave}
                        className={`max-w-[285px]`}
                        >Update</ButtonConfirm>
                        <button onClick={closeModal} className="flex items-center justify-center outline-2 outline-green-500 bg-midnight h-12 text-beige-200 rounded-lg text-3xl cursor-pointer w-[60%] max-w-[180px]">
                            <FiX />
                        </button>
                    </div>
                </div>
            </ModalItem>
        </>
    )
}

export default EditTable;