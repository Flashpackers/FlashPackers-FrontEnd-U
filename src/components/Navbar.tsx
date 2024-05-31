// Navbar.js
import React, { useState } from 'react';
import Logo from './../assets/logo.png';
import Menu from './Menu';
import Dishes from './Dishes';
import Favourite from './Favourite';
import YourCart from './YourCart';
import Menuicon from './../assets/icons/Menu.svg';
import Like from './../assets/icons/Favorite.svg';
import Cartimg from './../assets/icons/Cart.svg';
import Profile from './../assets/icons/Profile.svg';
import OrderHistory from './OrderHistory';

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

const Navbar: React.FC = () => {
  const [fav, setFav] = useState<boolean | null>(false);
  const [cart, setCart] = useState<boolean>(false);
  const [menu, setMenu] = useState<boolean | null>(true);
  const [dishdata, setDishData] = useState<menuItems>({});
  const [favitem, setFavItem] = useState<string[]>([]);
  const [orderhistory, setOrderHistory] = useState<boolean>(false);

  const handleaddtocart = (value: boolean) => {
    setFav(false);
    setMenu(false);
    setOrderHistory(false);
    setCart(value);
  };

  const handleFavourite = () => {
    setFav(true);
    setCart(false);
    setMenu(false);
    setOrderHistory(false);
  };

  const handleMenu = () => {
    setMenu(true);
    setCart(false);
    setFav(false);
    setOrderHistory(false);
  };

  const handleCart = () => {
    setCart(true);
    setMenu(false);
    setFav(false);
    setOrderHistory(false);
  };

  const handleFav = (newarray: string[]) => {
    setFavItem(newarray);
  };

  const handleHistory = () => {
    setOrderHistory(true);
    setCart(false);
    setMenu(false);
    setFav(false);
  };

  const handleBack = () => {
    console.log("caalle")
    setMenu(true);
    setFav(false);
    setCart(false);
    setOrderHistory(false);
  };

  return (
    <>
      <nav className='flex h-20 fixed top-0 w-full z-20 text-white rounded-b-3xl justify-center items-center' style={{ background: 'var(--bg-color)' }}>
        <div className='flex text-3xl font-bold gap-2 item-center'>
          <img src={Logo} alt='Logo' height={'280px'} width={'280px'} />
        </div>
      </nav>
      {menu && <Menu setdishdata={setDishData} />}
      {menu && <Dishes SetAddtocart={handleaddtocart} dishdata={dishdata} updateFavItem={handleFav} />}
      {fav && <Favourite SetAddtocart={handleaddtocart} updateFavItem={handleFav} handleBack={handleBack} />}
      {cart && <YourCart handleBack={handleBack} />}
      {orderhistory && <OrderHistory handleBack={handleBack} />}
      <footer>
        <div className='flex justify-around items-center h-14 text-white fixed bottom-0 w-full rounded-t-3xl' style={{ background: 'var(--bg-color)' }}>
          <div>
            <img onClick={handleMenu} className='w-9 h-9 hover:cursor-pointer' src={Menuicon} alt='Menu' />
          </div>
          <div>
            <img onClick={handleFavourite} className='w-9 h-9 hover:cursor-pointer' src={Like} alt='Favourite' />
          </div>
          <div>
            <img onClick={handleCart} className='w-9 h-9 hover:cursor-pointer' src={Cartimg} alt='Cart' />
          </div>
          <div>
            <img onClick={handleHistory} className='w-9 h-9 hover:cursor-pointer' src={Profile} alt='Profile' />
          </div>
        </div>
      </footer>
    </>
  );
};

export default Navbar;
