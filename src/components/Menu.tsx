import { useEffect, useState } from "react";
import React from 'react'
import './Main.css'
import axios, { AxiosResponse } from 'axios';
import AnimatedDiv from "./AnimatedDiv";
import Scroll from './../assets/icons/move.png'
interface menuItems {
  [key: string]: itemdetails[]
}

interface itemdetails {
  _id: string,
  name: string,
  price: number,
  description: string,
  type: string,
  subtype: string,
  image: string,
  category: string
}

interface MenuProps {
  setdishdata: React.Dispatch<React.SetStateAction<menuItems>>;
}
function Menu({ setdishdata }: MenuProps) {
  const link: string = `https://flashpackers-backend-u.onrender.com/`;
  const [data, setData] = useState<string>('Beverages');
  const [Types, setTypes] = useState<any[]>([]);
  const [dishData, setDishData] = useState<menuItems>({});
  const [subtypeindex, setSubtypeindex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null); // Initialize selectedIndex with 0
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const itemTypes: string = link + 'api/menu/getMenuTypes';
        const response: AxiosResponse<any> = await axios.get(itemTypes)
        setTypes(response.data)
      } catch (error) {
        console.error('There was a problem with the request:', error);
      }
    }
    fetchTypes();
  }, []);
  useEffect(() => {
    const fetchSubtypes = async () => {
      try {
        const subtypeURL: string = link + 'api/menu/getMenuFromType/';
        const response: AxiosResponse<any> = await axios.get(subtypeURL + data);
        const responseData = response.data;
        if (responseData && responseData.menuItemsBySubtype) {
          const menuItemsBySubtype: menuItems = responseData.menuItemsBySubtype;
          setDishData(menuItemsBySubtype);
          if (Object.keys(menuItemsBySubtype).length > 0) {
            const firstItemIndex = 0;
            handlebg(firstItemIndex);
            setdishdata(menuItemsBySubtype);
          }
        } else {
          console.error('Response data or menuItemsBySubtype property is undefined:', responseData);
        }
      } catch (error) {
        console.error('There was a problem with the request:', error);
      }
    };
    fetchSubtypes();
  }, [data]);
  
  
  useEffect(() => {
    if (Types.length > 0) {
      handleType(Types[0], 0);
    }
  }, [Types]);

  const handleType = (element: string, index: number) => {
    setData(element);
    if (selectedIndex !== null) {
      const prevItem = document.getElementsByTagName('li')[selectedIndex];
      if (prevItem) {
        prevItem.classList.remove('font-semibold', 'underline');
        prevItem.classList.add('font-medium');
      }
    }
    const listItem = document.getElementsByTagName('li')[index];
    if (listItem) {
      listItem.classList.remove('font-medium');
      listItem.classList.add('font-semibold', 'underline');
    }
    setSelectedIndex(index);
  };
  const handlebg = (index: number) => {
    if (subtypeindex != null) {
      const subtypebtn = document.getElementById(subtypeindex.toString());
      if (subtypebtn) {
        subtypebtn.style.color = 'var(--bg-color)';
        subtypebtn.style.backgroundColor = 'white';
      }
    }
    const nextbtn = document.getElementById(index.toString());
    if (nextbtn) {
      nextbtn.style.backgroundColor = 'var(--bg-color)';
      nextbtn.style.color = 'white';
      setSubtypeindex(index);
    }
  };

  return (
    <div className="w-full backdrop-blur-md fixed top-14 h-[115px] z-10">
      <AnimatedDiv className='px-3 z-10 flex fixed gap-1 h-fit w-full top-5 '>
        <div className='flex list-none overflow-x-auto no-scrollbar w-[95%] text-4xl space-x-1' style={{ color: 'var(--bg-color)', }}>
          {Types.map((element, index) => (
            <li onClick={() => handleType(element, index)} key={index} className="hovermenu font-meduim hover:cursor-pointer p-2 min-w-fit px-3 text-lg text-center">{element}</li>
          ))}
        </div>
        <div>
          <img src={Scroll} alt="" className="fixed top-[28.7px] mr-2 right-0.5 h-7 w-7" />
        </div>
      </AnimatedDiv>
      <AnimatedDiv className='px-4 flex un items-center h-[60px] z-10   fixed top-14 w-full overflow-x-auto no-scrollbar '>
        <ul className='flex px-2 text-4xl space-x-4 w-fit z-0 font-semibold' style={{ color: 'var(--bg-color)', zIndex: 10 }}>
          {Object.entries(dishData).map(([subtype, items], index) => (
            <a href={`#${subtype}`} key={index}>
              <li id={index.toString()} onClick={() => handlebg(index)} className="rounded-full p-2 h-8 min-w-full px-3 whitespace-nowrap text-lg font-medium flex items-center hover:cursor-pointer hover:bg-teal-500" style={{ backgroundColor: 'white', border: '2px solid var(--bg-color)' }}>
                {subtype}
              </li>
            </a>
          ))}
        </ul>
      </AnimatedDiv>
    </div>
  )
}

export default Menu