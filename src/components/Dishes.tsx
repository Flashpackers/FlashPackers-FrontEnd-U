import React, { useEffect, useState, useContext } from 'react';
import Unlike from './../assets/icons/unliked.png';
import Add from './../assets/icons/plus.png';
import Delete from './../assets/icons/delete.png';
import Minus from './../assets/icons/minus.png';
import Like from './../assets/icons/liked.png';
import AnimatedDiv from './AnimatedDiv';
import './Main.css';

interface menuItems {
    [key: string]: itemdetails[];
}

interface itemdetails {
    _id: string;
    name: string;
    price: number;
    description: string;
    type: string;
    subtype: string;
    image: string;
    category: string;
}

interface DishesProps {
    dishdata: menuItems;
    updateFavItem: React.Dispatch<React.SetStateAction<any>>;
    SetAddtocart: React.Dispatch<React.SetStateAction<any>>;
}

const Dishes: React.FC<DishesProps> = ({ dishdata, updateFavItem, SetAddtocart }) => {
    const [counts, setCounts] = useState<{ [key: string]: number }>(() => {
        const storedCounts = localStorage.getItem('counts');
        return storedCounts ? JSON.parse(storedCounts) : {};
    });
    const [favItems, setFavItems] = useState<string[]>([]);
    const [isButtonClicked, setIsButtonClicked] = useState(false);
    const [orderitems, setOrderItems] = useState<{ [key: string]: number }>(() => {
        const storedOrderList = localStorage.getItem('orderlist');
        return storedOrderList ? JSON.parse(storedOrderList) : {};
    });

    useEffect(() => {
        const storedFavItems = JSON.parse(localStorage.getItem('key') || '[]');
        setFavItems(storedFavItems);
        updateFavItem(storedFavItems);
    }, []);

    const handleAddbtn = (id: string) => {
        setCounts((prevCounts) => {
            if (!isButtonClicked) {
                setIsButtonClicked(true);
            }
            return { ...prevCounts, [id]: (prevCounts[id] || 0) + 1 };
        });
    
        setOrderItems((prevOrderItems) => {
            const newOrderItems = { ...prevOrderItems, [id]: (prevOrderItems[id] || 0) + 1 };
            return newOrderItems;
        });
    };
        const handleDelete = (id: string) => {
        setOrderItems((prevOrderItems) => {
            const newCount = Math.max((prevOrderItems[id] || 0) - 1, 0);
            const updatedOrderItems = { ...prevOrderItems };
            if (newCount === 0) {
                delete updatedOrderItems[id];
            } else {
                updatedOrderItems[id] = newCount;
            }
            return updatedOrderItems;
        });

        setCounts((prevCounts) => {
            const newCount = Math.max((prevCounts[id] || 0) - 1, 0);
            const updatedCounts = { ...prevCounts };
            if (newCount === 0) {
                setIsButtonClicked(false);
                delete updatedCounts[id];
            } else {
                updatedCounts[id] = newCount;
            }
            localStorage.setItem('counts', JSON.stringify(updatedCounts));
            return updatedCounts;
        });
    };

    const handleFav = (id: string) => {
        let updatedFavItems: string[] = [...favItems];
        const index = updatedFavItems.indexOf(id);
        if (index === -1) {
            updatedFavItems.push(id);
        } else {
            updatedFavItems.splice(index, 1);
        }
        setFavItems(updatedFavItems);
        localStorage.setItem('key', JSON.stringify(updatedFavItems));
    };

    const handleCart = () => {
        // Here you update the local storage with the counts
        localStorage.setItem('counts', JSON.stringify(counts));
        SetAddtocart(true);
    };

    return (
        <div id='list' className='h-[80%] pb-10 pt-20 scroll-smooth overflow-y-auto no-scroller top-[85px] px-5 fixed w-full'>
            {Object.entries(dishdata).map(([subtype, items], index) => (
                <AnimatedDiv key={subtype} className='flex flex-col mb-4'>
                    <h1 id={subtype} className='text-2xl font-semibold my-3 px-2' style={{ color: 'var(--bg-color)' }}>
                        {subtype}
                    </h1>
                    <hr className='w-full h-1 my-1 relative bottom-2' style={{ background: 'var(--bg-color)' }} />
                    <div className='flex flex-col '>
                        {items.map((item) => (
                            <div key={item._id} className='flex my-3 border-b-2 border-gray-300 justify-between'>
                                <div>
                                    <div className='text-lg font-medium'>{item.name}</div>
                                    <div className='text-sm'>Rs.{item.price}</div>
                                    <div className='text-sm font-normal flex flex-wrap'>{item.description}</div>
                                    {favItems.includes(item._id) ? (
                                        <div className='py-2' onClick={() => handleFav(item._id)}>
                                            <img src={Like} alt='' width={'24px'} height={'24px'} />
                                        </div>
                                    ) : (
                                        <div className='py-2' onClick={() => handleFav(item._id)}>
                                            <img src={Unlike} alt='' width={'24px'} height={'24px'} />
                                        </div>
                                    )}
                                </div>
                                <div className='flex flex-col items-center'>
                                    <div className='overflow-hidden w-20 h-20'>
                                        <img className='object-cover' src={item.image} alt='' height={'104px'} width={'104px'} />
                                    </div>

                                    {!counts[item._id] && (
                                        <button onClick={() => handleAddbtn(item._id)} className='bg-slate-100 hover:cursor-pointer relative bottom-7 left-5 sm:h-11 sm:w-11 h-8 w-8 rounded-full'>
                                            <img className='m-auto sm:h-4 h-3 sm:w-4 w-3 ' src={Add} alt='' />
                                        </button>
                                    )}
                                    {counts[item._id] && (
                                        <div key={index} className='bg-slate-100 flex gap-3 justify-evenly px-2 items-center hover:cursor-pointer relative bottom-7 left-4 h-10 w-24 rounded-full'>
                                            {counts[item._id] <= 1 && (
                                                <button onClick={() => handleDelete(item._id)} className='hover:bg-gray-300 rounded-3xl h-[30px] w-[40px]'>
                                                    <img className='m-auto sm:h-5 h-4 sm:w-5 w-4' src={Delete} alt='' />
                                                </button>
                                            )}
                                            {counts[item._id] > 1 && (
                                                <button onClick={() => handleDelete(item._id)} className='hover:bg-gray-300 rounded-3xl h-[30px] w-[40px]'>
                                                    <img className='m-auto sm:h-4 h-3 sm:w-4 w-3' src={Minus} alt='' />
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
                        ))}
                    </div>
                </AnimatedDiv>
            ))}
            {isButtonClicked && (
                <div className='w-full left-[1px] flex justify-center fixed bottom-20'>
                    <button onClick={handleCart} style={{ background: 'var(--bg-color)' }} className='w-36 text-xl rounded-full h-12 bg-black text-white'>
                        Add To Cart
                    </button>
                </div>
            )}
        </div>
    );
};

export default Dishes;
