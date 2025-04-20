import { FiImage } from "react-icons/fi";
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

function Item({item}: ItemProp) {
  return (
    <div
    key={item._id}
    data-property="item"
    className="grid grid-flow-row grid-cols-2 text-midnight gap-4 text-xl border-2 border-green-300 rounded-2xl pb-table-1"
    >
        {/* another approach can be done -> div>category,item in one div */}
        <div className="flex justify-start items-center">image</div>
        {item.imageUrl ? (
            <div className="overflow-hidden flex justify-center items-center">
                {/* <img className="w-32" src="https://community.fastly.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsUFJ5KBFZv668FFQwnfCcJmxDv9rhwIHZwqP3a-uGwz9Xv8F0j-qQrI3xiVLkrxVuZW-mJoWLMlhpWhFkc9M/360fx360f" alt={item.itemName} /> */}
                <img className="w-32" src={item.imageUrl} alt={item.itemName} />
            </div>
        ) : (
            <div className="relative text-beige-100 flex justify-center">
                <FiImage size={64}/>
            </div>
        )}
        <div className="flex justify-start items-center">item</div><div className="text-beige-100">{item.itemName}</div>
        <div className="flex justify-start items-center">date buy</div><div className="text-beige-100">{ new Date(item.buyDate* 1000).toLocaleDateString()}</div>
        <div className="flex justify-start items-center">price buy</div><div className="text-beige-100 font-display2">{item.buyPrice}</div>
        <div className="flex justify-start items-center">date sold</div><div className="text-beige-100">{item.soldDate ? ( new Date(item.soldDate* 1000).toLocaleDateString()): 'not sold'}</div>
        <div className="flex justify-start items-center">price sold</div><div className={`text-beige-100 ${ item.soldPrice ? "font-display2": ""}`}>{item.soldPrice ? ( item.soldPrice): 'not sold'}</div>
        <div className="flex justify-start items-center">profit</div><div className={`text-beige-100 ${ item.soldPrice ? "font-display2": ""}`}>{ item.soldPrice? (item.soldPrice - item.buyPrice > 0 ? `+${round10(item.soldPrice - item.buyPrice,-2)}`: round10(item.soldPrice - item.buyPrice,-2)): "not sold"}</div>
        <div className="col-span-2 flex items-center justify-center bg-midnight rounded-2xl mx-20 my-3 cursor-pointer"><div className="py-3 px-3 text-red">delete</div></div>
    </div>
  )
}

export default Item;