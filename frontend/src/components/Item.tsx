import { FiImage } from "react-icons/fi";
import ModalItem from "./ModalItem";
import { useState } from "react";
import Input from "./Input";
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

  const handleSave = () => {
    onUpdate(item._id, editedItem);
    // here logic validation -> writen below in modal -> have to be done before save
    closeModal();
  };

  const handleDelete = () => {
    onDelete(item._id);
    console.log(`item deleted ${item._id}`);
  };

  return (
    <>
      <div
      key={item._id}
      data-property="item"
      className="grid grid-flow-row grid-cols-2 text-midnight gap-4 text-xl border-2 border-green-300 rounded-2xl pb-table-1"
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
          <div className="flex justify-start items-center">date buy</div><div className="text-beige-100">{ new Date(item.buyDate* 1000).toLocaleDateString()}</div>
          <div className="flex justify-start items-center">price buy</div><div className="text-beige-100 font-display2">{item.buyPrice}</div>
          <div className="flex justify-start items-center">date sold</div><div className="text-beige-100">{item.soldDate ? ( new Date(item.soldDate* 1000).toLocaleDateString()): 'not sold'}</div>
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
              {/* <div className="text-red text-2xl">Error</div> */}
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
            </div>
            <div className="flex col-span-2 flex-col justify-center items-center mb-5">
              <Input
              placeholder="Enter item buy date"
              className="font-bold text-2xl!"
              value={editedItem.buyDate || Date.now()}
              onChange={handleInputChange}
              name="buyDate"
              type="date"
              />
              <div className="text-beige-100 leading-15">Pick date you bought item.</div>
            </div>
          </div>
          <div className="col-span-2">
            <div className="flex flex-col justify-center items-center mb-5">
              <Input
              placeholder="Enter item sold price"
              className="font-bold text-2xl!"
              value={editedItem.soldPrice || undefined}
              onChange={handleInputChange}
              name="soldPrice"
              type="number"
              />
              <div className="text-beige-100 leading-15">Enter price you bought item for.
              If you not sold yet, leave.</div>
            </div>
            <div className="flex flex-col justify-center items-center mb-5">
              <Input
              placeholder="Enter item sold date"
              className="font-bold text-2xl!"
              value={editedItem.soldDate || undefined}
              onChange={handleInputChange}
              name="soldDate"
              type="date"
              />
              <div className="text-beige-100 leading-15">Pick date you sold item
              If you not sold yet, leave.</div>
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
            </div>
          </div>
          {/* here add flex 2 divs with save button and close */}
        </div>
        {/* image url -> can be empty, check validation if not */}
        {/* item name -> check validation */}
        {/* buy date -> choose from calendar, convert to timestamp, cant be after sold date if sold date set */}
        {/* buy price -> number from 0+ */}
        {/* sold date -> can be null/empty, if set check if after buy date, if sold price not set but date sold set, set sold price to 0 */}
        {/* sold price -> number for 0+, if sold date not set, set sold date for current time -> convert to timestamp */}
        {/* dates from calendar will be chosen as date type */}
        {/* input type x value={editedItem.prop || ''} onChange={handleInputChange} */}
      </ModalItem>
    </>
  )
}

export default Item;