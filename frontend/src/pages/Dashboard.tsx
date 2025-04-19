import BarChart from '@/components/BarChart'
import Card from '@/components/Card'
import EditTable from '@/components/EditTable';
import Table from '@/components/Table';
import useItemStore from '@/store/useItemStore';
import { useEffect } from 'react';
import { FiPlusCircle } from "react-icons/fi";

// Średni zwrot z inwestycji (ROI) dla sprzedanych przedmiotów
// Średnia cena zakupu vs. średnia cena sprzedaży
// Najwięcej zarobionych pieniędzy na pojedynczym przedmiocie w całej historii
// Łączna liczba transakcji w danym okresie

// 
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
const recentSales = [
  {
    _id: "1",
    itemName: "AK-47 | Redline (Field-Tested)",
    buyPrice: 1200,
    buyDate: 1712937600000, // April 13, 2024
    soldPrice: 1450,
    soldDate: 1714233600000, // April 28, 2024
    imageUrl: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09-5lpKKqPrxN7LEmyVQ7MEpiLuSrYmnjQO3-UdsZGHyd4_Bd1RvNQ7T_FDrw-_ng5Pu75iY1zI97bhLsvQz/330x192"
  },
  {
    _id: "2",
    itemName: "AWP | Neo-Noir (Minimal Wear)",
    buyPrice: 3800,
    buyDate: 1711814400000, // March 30, 2024
    soldPrice: 4250,
    soldDate: 1714060800000, // April 26, 2024
    imageUrl: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJD_9W7m5a0mvLwOq7cqWdQ-sJ0xOzAot-jiQa1_hBqYzvzLdSVJlQ3NQvR-FfsxL3qh5e7vM6bzSAy6CJ253jD30vgHvBe_ow/330x192"
  },
  {
    _id: "3",
    itemName: "Gloves | Crimson Kimono (Field-Tested)",
    buyPrice: 8500,
    buyDate: 1709222400000, // March 1, 2024
    soldPrice: 9800,
    soldDate: 1713888000000, // April 24, 2024
  },
  {
    _id: "4",
    itemName: "M4A4 | The Emperor (Factory New)",
    buyPrice: 2800,
    buyDate: 1712592000000, // April 9, 2024
    soldPrice: 3100,
    soldDate: 1713542400000, // April 20, 2024
    imageUrl: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJTwW09-vloWZh-L6OITdn2xZ_Pp9i_vG8MKs3VKyrUVsMWqhcYKSdAI5ZA2E81m3xu-50JK0vs7AzXpnuyhz7CnYgVXp1nPiiZx0/330x192"
  },
  {
    _id: "5",
    itemName: "USP-S | Kill Confirmed (Well-Worn)",
    buyPrice: 1750,
    buyDate: 1711468800000, // March 26, 2024
    soldPrice: 1950,
    soldDate: 1713369600000, // April 18, 2024
    imageUrl: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8j_OrfdqWhe5sN4mOTE8bP5gVO8vywwMiukcZjBdQRvYQ2Frlm_xrjvgsW76MjKwHFm7CB25HzfyQv330_bIYOPYA/330x192"
  }
];

function Dashboard() {
  const { fetchItems, items, error, pagination } = useItemStore();

  useEffect(()=>{
    fetchItems();
  }, [fetchItems]);
  
  const soldItems = items.filter((item) => {return item.soldDate})
  // for (const item in soldItems) {
  //   if (Object.prototype.hasOwnProperty.call(soldItems, item)) {
  //     console.log(soldItems[item]);
  //   }
  // }
  // console.log(items.length > 1&& items[0]._id);
  // console.log(pagination);
  // console.log(error);

  const handleOpenModal = () => {
    console.log('modal open');
  };
  
  return (
    <>
    <div className="flex flex-col gap-5 mx-4 my-3 items-center">
      <div className='text-7xl mb-5 text-green-300 cursor-pointer hover:text-green-100' onClick={handleOpenModal}>
      <FiPlusCircle />
      </div>
      { false && (
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
      )}
      { false && (
        <div className='w-full flex flex-col gap-5 items-center'>
          <BarChart data={monthlyData}></BarChart>
          <Table items={soldItems}></Table>
        </div>
      )}
      <div>
        {/* pamietac ze jak nie ma zaladowanych przedmiotow to ma wyswietlic ze czeka za przedmiotami */}
        {/* tablica do edytowania rekordow z useitemstore */}
        <EditTable/>
      </div>
    </div>
    </>
  )
}

export default Dashboard