import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Like from './../assets/icons/liked.png';
import Add from './../assets/icons/plus.png';
import Delete from './../assets/icons/delete.png';
import Minus from './../assets/icons/minus.png';
import Loading from './../assets/spinner.svg'
interface FavoriteProps {
  SetAddtocart: React.Dispatch<React.SetStateAction<any>>;
  updateFavItem: React.Dispatch<React.SetStateAction<any>>;
  handleBack: () => void;
}

interface Product {
  _id: string;
  name: string;
  category: string;
  createdAt: string;
  description: string;
  image: string;
  price: number;
  subtype: string;
  type: string;
  updatedAt: string;
}

function Favourite({ updateFavItem, SetAddtocart, handleBack }: FavoriteProps) {
  const [favlist, setFavList] = useState<Product[]>([]);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const link: string = `https://flashpackers-backend-u.onrender.com/`;
  const [favItem, setFavItem] = useState<string[]>([]);
  const [orderitems, setOrderItems] = useState<{ [key: string]: number }>(() => {
    const storedOrderList = localStorage.getItem('orderlist');
    return storedOrderList ? JSON.parse(storedOrderList) : {};
  });
  const [counts, setCounts] = useState<{ [key: string]: number }>(() => {
    const storedCounts = localStorage.getItem('counts');
    return storedCounts ? JSON.parse(storedCounts) : {};
  });

  useEffect(() => {
    const storedFavItems = JSON.parse(localStorage.getItem('key') || '[]');
    if (storedFavItems.length === 0) {
      setFavList([]);
      setLoading(false); // Update loading state
    } else {
      axios.post(link + 'api/menu/getMenuByArray', { items: storedFavItems })
        .then(response => {
          setFavList(response.data);
          setLoading(false); // Update loading state
        })
        .catch(error => {
          console.error('Can\'t fetch the Favorite items:', error);
          setLoading(false); // Update loading state in case of error
        });
    }
    setFavItem(storedFavItems);
  }, [link]);

  // useEffect(() => {
  //   localStorage.setItem('counts', JSON.stringify(counts));
  // }, [counts]);

  const handleFav = async (id: string) => {
    const updatedFavItems = favItem.filter(itemId => itemId !== id);
    setFavItem(updatedFavItems);
    localStorage.setItem('key', JSON.stringify(updatedFavItems));

    if (updatedFavItems.length === 0) {
      setFavList([]);
    } else {
      try {
        const response = await axios.post(link + 'api/menu/getMenuByArray', { items: updatedFavItems });
        setFavList(response.data);
      } catch (error) {
        console.error('Can\'t fetch the Favorite items:', error);
      }
    }
  };

  const handleAddbtn = (id: string) => {
    setOrderItems(prevOrderItems => ({ ...prevOrderItems, [id]: (prevOrderItems[id] || 0) + 1 }));
    setCounts(prevCounts => ({ ...prevCounts, [id]: (prevCounts[id] || 0) + 1 }));
    setIsButtonClicked(true);
  };

  const handleDelete = (id: string) => {
    setOrderItems(prevOrderItems => {
      const newCount = Math.max((prevOrderItems[id] || 0) - 1, 0);
      const updatedOrderItems = { ...prevOrderItems };
      if (newCount === 0) {
        delete updatedOrderItems[id];
        setIsButtonClicked(false);
      } else {
        updatedOrderItems[id] = newCount;
      }
      return updatedOrderItems;
    });
    setCounts(prevCounts => {
      const newCount = Math.max((prevCounts[id] || 0) - 1, 0);
      const updatedCounts = { ...prevCounts };
      if (newCount === 0) {
        delete updatedCounts[id];
      } else {
        updatedCounts[id] = newCount;
      }
      return updatedCounts;
    });
  };

  const handleCart = () => {
    localStorage.setItem('counts', JSON.stringify(counts));
    SetAddtocart(true);
  };

  return (
    <div className='text-black px-5 w-full h-full fixed top-[100px]'>
      {loading ? (
        <div className='text-center relative top-44 justify-center flex'>
          <img src={Loading} alt="" height={'100px'} width={'100px'} />
        </div>
      ) : (
        <div>
          <div className='flex w-full right-[0.4px] fixed items-end pb-3 backdrop-blur-md z-10 h-20 top-16'>
              <svg onClick={handleBack} className='cursor-pointer relative left-3' width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.4334 17.3333L16.9668 23.8667C17.2334 24.1333 17.3614 24.4444 17.3508 24.8C17.3401 25.1556 17.201 25.4667 16.9334 25.7333C16.6668 25.9778 16.3557 26.1058 16.0001 26.1173C15.6446 26.1289 15.3334 26.0009 15.0668 25.7333L6.26678 16.9333C6.13345 16.8 6.03878 16.6555 5.98278 16.5C5.92678 16.3444 5.89967 16.1778 5.90145 16C5.90145 15.8222 5.92945 15.6555 5.98545 15.5C6.04145 15.3444 6.13523 15.2 6.26678 15.0667L15.0668 6.26666C15.3112 6.02222 15.617 5.89999 15.9841 5.89999C16.3512 5.89999 16.6677 6.02222 16.9334 6.26666C17.2001 6.53333 17.3334 6.85022 17.3334 7.21733C17.3334 7.58444 17.2001 7.90088 16.9334 8.16666L10.4334 14.6667H25.3335C25.7112 14.6667 26.0281 14.7947 26.2841 15.0507C26.5401 15.3067 26.6677 15.6231 26.6668 16C26.6668 16.3778 26.5388 16.6947 26.2828 16.9507C26.0268 17.2067 25.7103 17.3342 25.3335 17.3333H10.4334Z" fill="black" />
              </svg>
            <div className='w-full ml-6 text-lg font-medium relative right-3 float-end text-center'>Your favourite</div>
          </div>
          <div className='h-full w-full relative top-10 mb-3'>
            {favlist.length === 0 ? (
              <div className='text-center relative top-44'>No Favourites</div>
            ) : (
              favlist.map((item, index) => (
                <div key={item._id} className='flex my-3 border-b-2 border-gray-300 justify-between'>
                  <div>
                    <div className='text-lg font-medium'>{item.name}</div>
                    <div className='text-sm'>Rs.{item.price}</div>
                    <div className='text-sm font-normal flex flex-wrap'>{item.description}</div>
                    <div className='py-2' onClick={() => handleFav(item._id)}>
                      <img src={Like} alt="" width={'24px'} height={'24px'} />
                    </div>
                  </div>
                  <div className='flex flex-col items-center'>
                    <div className='overflow-hidden w-20 h-20'>
                      <img className='object-cover' src={item.image} alt="" height={'104px'} width={'104px'} />
                    </div>
                    {!counts[item._id] && (
                      <button onClick={() => handleAddbtn(item._id)} className='bg-slate-100 hover:cursor-pointer relative bottom-7 left-5 sm:h-11 sm:w-11 h-8 w-8 rounded-full'>
                        <img className='m-auto sm:h-4 h-3 sm:w-4 w-3' src={Add} alt="" />
                      </button>
                    )}
                    {counts[item._id] && (
                      <div key={index} className='bg-slate-100 flex gap-3 justify-evenly px-2 items-center hover:cursor-pointer relative bottom-7 left-4 h-10 w-24 rounded-full'>
                        {counts[item._id] <= 1 && (
                          <button onClick={() => handleDelete(item._id)} className='hover:bg-gray-300 rounded-3xl h-[30px] w-[40px]'>
                            <img className='m-auto sm:h-5 h-4 sm:w-5 w-4' src={Delete} alt="" />
                          </button>
                        )}
                        {counts[item._id] > 1 && (
                          <button onClick={() => handleDelete(item._id)} className='hover:bg-gray-300 rounded-3xl h-[30px] w-[40px]'>
                            <img className='m-auto sm:h-4 h-3 sm:w-4 w-3' src={Minus} alt="" />
                          </button>
                        )}
                        <p className='text-xl'>{counts[item._id]}</p>
                        <button onClick={() => handleAddbtn(item._id)} className='hover:bg-gray-200 rounded-3xl h-[30px] w-[40px]'>
                          <img className='m-auto sm:h-4 h-3 sm:w-4 w-3' src={Add} alt="" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          {isButtonClicked && <div className='w-full flex justify-center fixed bottom-20'>
            <button onClick={handleCart} style={{ background: 'var(--bg-color)' }} className='w-36 text-xl rounded-full h-12 bg-black text-white'>
              Add To Cart
            </button>
          </div>}
        </div>
      )}
    </div>
  );
}

export default Favourite;

