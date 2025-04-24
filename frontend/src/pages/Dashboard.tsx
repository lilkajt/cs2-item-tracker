import BarChart from '@/components/BarChart'
import ButtonConfirm from '@/components/ButtonConfirm';
import Card from '@/components/Card'
import { DatePicker } from '@/components/DatePicker';
import EditTable from '@/components/EditTable';
import Input from '@/components/Input';
import ModalItem from '@/components/ModalItem';
import Table from '@/components/Table';
import useItemStore, { Item } from '@/store/useItemStore';
import axios from 'axios';
import { FormEvent, useState } from 'react';
import { FiPlusCircle, FiX } from "react-icons/fi";

// Średni zwrot z inwestycji (ROI) dla sprzedanych przedmiotów
// Średnia cena zakupu vs. średnia cena sprzedaży
// Najwięcej zarobionych pieniędzy na pojedynczym przedmiocie w całej historii
// Łączna liczba transakcji w danym okresie

const monthlyData = [
  { name: 'Jan', value: 45 },
  { name: 'Feb', value: 62 },
  { name: 'Mar', value: 28 },
  { name: 'Apr', value: 50 },
  { name: 'May', value: 75 },
  { name: 'Jun', value: 35 },
  { name: 'Jan', value: 45 },
  { name: 'Feb', value: 62 },
  { name: 'Mar', value: 28 },
  { name: 'Apr', value: 50 },
  { name: 'May', value: 75 },
  { name: 'Jun', value: 35 },
];
const itemRegex = /^[a-zA-Z0-9! |★壱()-™]+$/;
const priceRegex = /^-?\d+(\.\d{1,2})?$/;
const itemUrlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;

function Dashboard() {
  const { items, fetchItems, pagination } = useItemStore();
  const soldItems = items.filter((item) => {return item.soldDate});
  const [open, setOpen] = useState(false);
  const [value, setValues] = useState<Partial<Item>>({});
  const [errors, setErrors] = useState({
    imageUrl: '',
    itemName: '',
    buyPrice: '',
    buyDate: '',
    soldPrice: '',
    soldDate: '',
    main: ''
  });

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setValues({
      itemName: '',
      buyPrice: undefined,
      buyDate: undefined,
      soldPrice: null,
      soldDate: null,
      imageUrl: null
    });
    setErrors({
      imageUrl: '',
      itemName: '',
      buyPrice: '',
      buyDate: '',
      soldPrice: '',
      soldDate: '',
      main: ''
    });
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (validateData(value)){
      await axios.post('/api/item/create', value)
      .then( () => {
        // toast success
        closeModal();
        fetchItems(pagination.currentPage);
      })
      .catch( error => {
        setErrors( prev => ({
          ...prev,
          main: error.response.data.message || 'Failed to add item'
        }));
      });
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setErrors( prev => ({
      ...prev,
      main: ''
    }));

    setValues( prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors( prev => ({
        ...prev,
        [name]: ''
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
      soldDate: '',
      main: ''
    };
    let isValid = true;
    
    if (!data.itemName || data.itemName.trim() === '') {
      errors.itemName = 'Item name is required';
      isValid = false;
    } else if (!itemRegex.test(data.itemName)) {
      errors.itemName = 'Item name contains invalid characters';
      isValid = false;
    };
    
    if (data.buyPrice === undefined || data.buyPrice === null || data.buyPrice < 0) {
      errors.buyPrice = 'Buy price must be 0 or greater';
      isValid = false;
    } else if (!priceRegex.test(String(data.buyPrice))) {
      errors.buyPrice = 'Buy price must be a valid number with up to 2 decimal places';
      isValid = false;
    };

    if (!data.buyDate){
      errors.buyDate = "Buy date must be valid."
      isValid = false;
    };
    
    if (data.imageUrl && data.imageUrl.trim() !== '' && !itemUrlRegex.test(data.imageUrl)) {
      errors.imageUrl = 'Please enter a valid image URL';
      isValid = false;
    };

    if (data.soldDate && (!data.soldPrice || Number(data.soldPrice) === 0)) {
      data.soldPrice = 0;
    };

    if (data.soldPrice && Number(data.soldPrice) > 0 && !data.soldDate) {
      data.soldDate = Date.now();
    };
    
    if (data.soldPrice !== undefined && data.soldPrice !== null && String(data.soldPrice) !== '') {
      if (Number(data.soldPrice) < 0) {
        errors.soldPrice = 'Sold price must be 0 or greater';
        isValid = false;
      } else if (!priceRegex.test(String(data.soldPrice))) {
        errors.soldPrice = 'Sold price must be a valid number with up to 2 decimal places';
        isValid = false;
      }
    };
    
    if (data.buyDate && data.soldDate && data.buyDate > data.soldDate) {
      errors.soldDate = 'Sold date must be after buy date';
      isValid = false;
    };

    setErrors(errors);
    return isValid;
  };

  const handleBuyDateChange = (date: Date | undefined) => {
    setValues(prev => ({
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
    setValues(prev => ({
      ...prev,
      soldDate: date ? date.getTime() : null
    }));
  
    if (errors.soldDate) {
      setErrors(prev => ({
        ...prev,
        soldDate: ''
      }));
    }
  };

  return (
    <>
    <div className="flex flex-col gap-5 mx-4 my-3 items-center">
      <div className='text-7xl mb-5 text-green-300 cursor-pointer hover:text-green-100' onClick={openModal}>
      <FiPlusCircle />
      </div>
      <div className='flex justify-center flex-row flex-wrap gap-4.5'>
        <Card
        icon='dollar'
        title='Total revenue'
        amount='$45,231.89'
        subtitle='+20.1% from last month'
        ></Card>
        <Card
        icon='chart'
        title='Profits'
        amount='$24,040.11'
        subtitle='-11% from last month'
        ></Card>
        <Card
        icon='card'
        title='Sales'
        amount='+32'
        subtitle='-24% from last month'
        ></Card>
        <Card
        icon='monitor'
        title='Active now'
        amount='4'
        subtitle='+0% from last month'
        ></Card>
      </div>
      <div className='w-full flex flex-col gap-5 items-center'>
        <BarChart data={monthlyData}></BarChart>
        <Table items={soldItems}></Table>
      </div>
      <div className='w-full'>
        <EditTable/>
      </div>
    </div>
    <ModalItem open={open} onClose={closeModal}>
      <div className="grid grid-flow-row grid-cols-2 justify-center items-center mx-5 my-25 gap-9">
        <div className="col-span-2">
          { errors.main ? (
            <div className='text-red text-4xl pb-15 text-center'>{errors.main}</div>
          ): ''}
          <div className="flex flex-col justify-center items-center mb-5">
            <Input
            placeholder="Choose item or write"
            className={`font-bold sm:text-2xl ${ errors.itemName ? "outline-red text-red": ""}`}
            value={value.itemName || ''}
            onChange={handleChange}
            name="itemName"
            />
            <div className="text-beige-100 leading-15">Search for item you would like to add or write your own.</div>
            { errors.itemName ? (
              <div className="text-red text-2xl w-72">{errors.itemName}</div>
            ): ""}
          </div>
          <div className="flex col-span-2 flex-col justify-center items-center mb-5">
            <Input
            placeholder="Write buy price"
            className={`font-bold sm:text-2xl ${ errors.buyPrice ? "outline-red text-red": ""}`}
            value={value.buyPrice || ""}
            onChange={handleChange}
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
            date={value.buyDate ? new Date(value.buyDate) : undefined}
            onSelect={handleBuyDateChange}
            placeholder="Enter item buy date"
            className={`${ errors.buyDate ? "outline-red text-red": ""}`}
            />
            <div className="text-beige-100 leading-15">Pick date you bought item.</div>
            { errors.buyDate ? (
              <div className="text-red text-2xl w-72">{errors.buyDate}</div>
            ): ""}
          </div>
        </div>
        <div className="col-span-2">
          <div className="flex flex-col justify-center items-center mb-5">
            <Input
            placeholder="Enter item sold price"
            className={`font-bold sm:text-2xl ${ errors.soldPrice ? "outline-red text-red": ""}`}
            value={value.soldPrice || ""}
            onChange={handleChange}
            name="soldPrice"
            type="number"
            />
            <div className="text-beige-100 leading-15">Enter price you sold item for.
            If not sold yet, leave.</div>
            { errors.soldPrice ? (
              <div className="text-red text-2xl w-72">{errors.soldPrice}</div>
            ): ""}
          </div>
          <div className="flex flex-col justify-center items-center mb-5">
            <DatePicker 
            date={value.soldDate ? new Date(value.soldDate) : undefined}
            onSelect={handleSoldDateChange}
            placeholder="Enter item sold date"
            className={`${ errors.soldDate ? "outline-red text-red": ""}`}
            />
            <div className="text-beige-100 leading-15">Pick date you sold item
            If not sold yet, leave.</div>
            { errors.soldDate ? (
              <div className="text-red text-2xl w-72">{errors.soldDate}</div>
            ): ""}
          </div>
          <div className="flex col-span-2 flex-col justify-center items-center mb-5">
            <Input
            placeholder="write image url"
            className={`font-bold sm:text-2xl ${ errors.imageUrl ? "outline-red text-red": ""}`}
            value={value.imageUrl || ''}
            onChange={handleChange}
            name="imageUrl"
            />
            <div className="text-beige-100 leading-15">Enter image url.</div>
            { errors.imageUrl ? (
              <div className="text-red text-2xl w-72">{errors.imageUrl}</div>
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

export default Dashboard