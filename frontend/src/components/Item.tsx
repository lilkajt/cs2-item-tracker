import { FiImage, FiX } from "react-icons/fi";
import ModalItem from "./ModalItem";
import { useState } from "react";
import Input from "./Input";
import ButtonConfirm from "./ButtonConfirm";
import { DatePicker } from "./DatePicker";

interface Item {
  _id: string
  itemName: string
  buyPrice: number
  buyDate: number
  soldPrice?: number
  soldDate?: number
  imageUrl?: string
};

interface ItemProp {
  item: Item
  onDelete: (id: string) => void
  onUpdate: (id: string, updatedItem: Partial<Item>) => void
}

function decimalAdjust(type:string, value:number, exp:number) {
  type = String(type);
  if (!["round", "floor", "ceil"].includes(type)) {
    throw new TypeError(
      "The type of decimal adjustment must be one of 'round', 'floor', or 'ceil'.",
    );
  }
  exp = Number(exp);
  value = Number(value);
  if (exp % 1 !== 0 || Number.isNaN(value)) {
    return NaN;
  } else if (exp === 0) {
    return Math[type](value);
  }
  const [magnitude, exponent = 0] = value.toString().split("e");
  const adjustedValue = Math[type](`${magnitude}e${exponent - exp}`);
  // Shift back
  const [newMagnitude, newExponent = 0] = adjustedValue.toString().split("e");
  return Number(`${newMagnitude}e${+newExponent + exp}`);
};

const round10 = (value:number, exp:number) => decimalAdjust("round", value, exp);

function Item({item, onUpdate, onDelete}: ItemProp) {
  const [open, setOpen] = useState(false);
  const [editedItem,setEditedItem] = useState<Partial<Item>>({});
  const [errors,setErrors] = useState({
    imageUrl:'',
    itemName: '',
    buyPrice: '',
    buyDate: '',
    soldPrice: '',
    soldDate: ''
  });

  const openModal = () => {
    setEditedItem({
      imageUrl: item.imageUrl || '',
      itemName: item.itemName,
      buyPrice: item.buyPrice,
      buyDate: item.buyDate,
      soldPrice: item.soldPrice || 0,
      soldDate: item.soldDate || undefined
    });
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    console.log(`name ${name}, value ${value}`);
    setEditedItem(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors( prev => ({
        ...prev,
        [name]: ''
      }));
    };
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

  const handleSave = () => {
    onUpdate(item._id, editedItem);
    // here logic validation -> writen below in modal -> have to be done before save
    {/* 
      image url -> can be empty, check validation if not
      item name -> check validation
      buy date -> choose from calendar, convert to timestamp, cant be after sold date if sold date set
      buy price -> number from 0+
      sold date -> can be null/empty, if set check if after buy date, if sold price not set but date sold set, set sold price to 0
      sold price -> number for 0+, if sold date not set, set sold date for current time -> convert to timestamp
    */}
    closeModal();
  };

  const handleDelete = () => {
    onDelete(item._id);
  };

  return (
    <>
      <div
      key={item._id}
      data-property="item"
      className="grid grid-flow-row grid-cols-2 text-midnight gap-4 text-xl pb-table-1"
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
          <div className="flex justify-start items-center">date buy</div><div className="text-beige-100">{ new Date(item.buyDate).toLocaleDateString()}</div>
          <div className="flex justify-start items-center">price buy</div><div className="text-beige-100 font-display2">{item.buyPrice}</div>
          <div className="flex justify-start items-center">date sold</div><div className="text-beige-100">{item.soldDate ? ( new Date(item.soldDate).toLocaleDateString()): 'not sold'}</div>
          <div className="flex justify-start items-center">price sold</div><div className={`text-beige-100 ${ item.soldPrice ? "font-display2": ""}`}>{item.soldPrice ? ( item.soldPrice): 'not sold'}</div>
          <div className="flex justify-start items-center">profit</div><div className={`text-beige-100 ${ item.soldPrice ? "font-display2": ""}`}>{ item.soldPrice? (item.soldPrice - item.buyPrice > 0 ? `+${round10(item.soldPrice - item.buyPrice,-2)}`: round10(item.soldPrice - item.buyPrice,-2)): "not sold"}</div>
          <div className="flex items-center justify-center bg-midnight rounded-2xl mr-3 my-3 cursor-pointer" onClick={openModal}><div className="py-3 px-3 text-green-300">edit</div></div>
          <div className="flex items-center justify-center bg-midnight rounded-2xl ml-3 my-3 cursor-pointer" onClick={handleDelete}><div className="py-3 px-3 text-red">delete</div></div>
      </div>
      <ModalItem
      open={open}
      onClose={closeModal}
      >
        <div className="grid grid-flow-row grid-cols-2 justify-center items-center mx-5 my-25 gap-9">
          <div className="col-span-2">
            <div className="flex flex-col justify-center items-center mb-5">
              <Input
              placeholder="Choose item or write"
              className="font-bold text-2xl!"
              value={editedItem.itemName || ''}
              onChange={handleInputChange}
              name="itemName"
              />
              <div className="text-beige-100 leading-15">Search for item you would like to add or write your own.</div>
              { errors.itemName ? (
                <div className="text-red text-2xl">{errors.itemName}</div>
              ): ""}
            </div>
            <div className="flex col-span-2 flex-col justify-center items-center mb-5">
              <Input
              placeholder="Write buy price"
              className="font-bold text-2xl!"
              value={editedItem.buyPrice || 0}
              onChange={handleInputChange}
              name="buyPrice"
              type="number"
              />
              <div className="text-beige-100 leading-15">Enter price you bought item for.</div>
              { errors.buyPrice ? (
                <div className="text-red text-2xl">{errors.buyPrice}</div>
              ): ""}
            </div>
            <div className="flex col-span-2 flex-col justify-center items-center mb-5">
              <DatePicker 
              date={editedItem.buyDate ? new Date(editedItem.buyDate) : undefined}
              onSelect={handleBuyDateChange}
              placeholder="Enter item buy date"
              className=""
              />
              <div className="text-beige-100 leading-15">Pick date you bought item.</div>
              { errors.buyDate ? (
                <div className="text-red text-2xl">{errors.buyDate}</div>
              ): ""}
            </div>
          </div>
          <div className="col-span-2">
            <div className="flex flex-col justify-center items-center mb-5">
              <Input
              placeholder="Enter item sold price"
              className="font-bold text-2xl!"
              value={editedItem.soldPrice || ""}
              onChange={handleInputChange}
              name="soldPrice"
              type="number"
              />
              <div className="text-beige-100 leading-15">Enter price you sold item for.
              If not sold yet, leave.</div>
              { errors.soldPrice ? (
                <div className="text-red text-2xl">{errors.soldPrice}</div>
              ): ""}
            </div>
            <div className="flex flex-col justify-center items-center mb-5">
              <DatePicker 
              date={editedItem.soldDate ? new Date(editedItem.soldDate) : undefined}
              onSelect={handleSoldDateChange}
              placeholder="Enter item sold date"
              className=""
              />
              <div className="text-beige-100 leading-15">Pick date you sold item
              If not sold yet, leave.</div>
              { errors.soldDate ? (
                <div className="text-red text-2xl">{errors.soldDate}</div>
              ): ""}
            </div>
            <div className="flex col-span-2 flex-col justify-center items-center mb-5">
              <Input
              placeholder="write image url"
              className="font-bold text-2xl!"
              value={editedItem.imageUrl || ''}
              onChange={handleInputChange}
              name="imageUrl"
              />
              <div className="text-beige-100 leading-15">Write image url.</div>
              { errors.imageUrl ? (
                <div className="text-red text-2xl">{errors.imageUrl}</div>
              ): ""}
            </div>
          </div>
          <div className="col-span-2 flex flex-row justify-center items-center mb-5 gap-5 sm:mx-20">
            <ButtonConfirm onClick={handleSave}>Save</ButtonConfirm>
            <button onClick={closeModal} className="flex items-center justify-center outline-2 outline-green-500 bg-midnight h-12 text-beige-200 rounded-lg text-3xl cursor-pointer w-[60%]">
              <FiX />
            </button>
          </div>
        </div>
      </ModalItem>
    </>
  )
}

export default Item;