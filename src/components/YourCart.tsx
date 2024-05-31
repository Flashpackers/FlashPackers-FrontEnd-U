import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Add from './../assets/icons/plus.png';
import Delete from './../assets/icons/delete.png';
import Minus from './../assets/icons/minus.png';
import Loading from './../assets/spinner.svg';
import Form from './Form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './cart.css';
import Up from './../assets/icons/up..svg';
import Down from './../assets/icons/down.svg';
import Close from './../assets/icons/close.svg';

interface UserDetails {
  customerName: string;
  customerEmail: string;
  customerPhoneNumber: string;
}

interface OrderItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  type: string;
  subtype: string;
  image: string;
  quantity: string;
}
interface YourCartProps {
  handleBack: () => void; // Define handleBack as a function that doesn't take any arguments and returns void
}

const YourCart: React.FC<YourCartProps> = ({handleBack}) => {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(false);
  const [animating, setAnimating] = useState(false); // New state for animation
  const [orderdetails, setOrderDetails] = useState<object>();
  const [userdetails, setUserDetails] = useState<object>();
  const [orderres, setOrderRes] = useState<OrderItem[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const link: string = `https://flashpackers-backend-u.onrender.com/`;
  const [counts, setCounts] = useState<{ [key: string]: number }>(() => {
    const storedCounts = localStorage.getItem('counts');
    return storedCounts ? JSON.parse(storedCounts) : {};
  });
  const formRef = useRef<HTMLDivElement>(null);

  const calculateTotalPrice = () => {
    return orderres.reduce((total, item) => total + item.price * (counts[item._id] || 0), 0);
  };

  const fetchOrderItems = async (counts: { [key: string]: number }) => {
    if (Object.keys(counts).length === 0) {
      setOrderRes([]);
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post(link + 'api/menu/getMenuByObject', { items: counts });
      setOrderRes(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Can't fetch the order items:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialFetch = async () => {
      const storedCounts = localStorage.getItem('counts');
      if (storedCounts) {
        const parsedCounts = JSON.parse(storedCounts);
        await fetchOrderItems(parsedCounts);
      } else {
        setLoading(false);
      }
    };

    initialFetch();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setShowForm(false);
      }
    };

    if (showForm) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showForm]);

  const updateCountsAndFetchItems = (newCounts: { [key: string]: number }) => {
    if (Object.keys(newCounts).length === 0) {
      localStorage.removeItem('counts');
      setOrderRes([]);
    } else {
      localStorage.setItem('counts', JSON.stringify(newCounts));
      fetchOrderItems(newCounts);
    }
  };

  const handleAddbtn = (id: string) => {
    setCounts((prevCounts) => {
      const newCounts = { ...prevCounts, [id]: (prevCounts[id] || 0) + 1 };
      updateCountsAndFetchItems(newCounts);
      return newCounts;
    });
  };

  const handleDelete = (id: string) => {
    setCounts((prevCounts) => {
      const newCount = Math.max((prevCounts[id] || 0) - 1, 0);
      const updatedCounts = { ...prevCounts };
      if (newCount === 0) {
        delete updatedCounts[id];
        // Filter out the item from orderres
        setOrderRes((prevOrderRes) => prevOrderRes.filter(item => item._id !== id));
      } else {
        updatedCounts[id] = newCount;
      }
      updateCountsAndFetchItems(updatedCounts);
      return updatedCounts;
    });
  };

  const handleCustomer = (obj: object) => {
    setUserDetails(obj);
  }

  useEffect(() => {
    if (userdetails) {
      const userDetailsTyped = userdetails as UserDetails;
      localStorage.setItem('customerDetails', JSON.stringify(userDetailsTyped));
      setOrderDetails({
        'orderItems': counts,
        'customerName': userDetailsTyped.customerName,
        'customerEmail': userDetailsTyped.customerEmail,
        'customerPhoneNumber': userDetailsTyped.customerPhoneNumber
      });
    }
  }, [userdetails]);

  const fetchOrder = async (orderdetails: object) => {
    try {
      const response = await axios.post(link + 'api/order/addOrder', { orderdetails });
      setShowForm(false);
      if (response.status === 201) {
        setCounts({});
        setOrderRes([]);
        localStorage.removeItem('counts');
        toast.success("Item ordered successfully!", {
          className: 'custom-toast'
        });
      }
    } catch (error) {
      console.error("Can't fetch the order items:", error);
      toast.error("Failed to order item!", {
        className: 'custom-toast'
      });
    }
  };

  useEffect(() => {
    if (orderdetails)
      fetchOrder(orderdetails);
  }, [orderdetails]);

  const handleClose = () => {
    setAnimating(true);
    setTimeout(() => {
      setSummary(false);
      setAnimating(false);
    }, 300);
  };
  const handlesummarybtn = () => {
    if(summary===true){
      setAnimating(true);
      setTimeout(() => {
        setSummary(false);
        setAnimating(false);
      }, 300);
    }
  };

  return (
    <div className='fixed overflow-y-auto flex flex-col justify-between top-24 h-full w-full'>
      <div>
        {loading && <div className="flex justify-center text-center relative  top-44">
          <img src={Loading} alt="Loading" height={'100px'} width={'100px'} />
        </div>}
        <div className='flex w-full fixed items-end pb-3 backdrop-blur-md z-10 h-20 top-16'>
          <svg  onClick={handleBack} className='relative left-3' width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.4334 17.3333L16.9668 23.8667C17.2334 24.1333 17.3614 24.4444 17.3508 24.8C17.3401 25.1556 17.201 25.4667 16.9334 25.7333C16.6668 25.9778 16.3557 26.1058 16.0001 26.1173C15.6446 26.1289 15.3334 26.0009 15.0668 25.7333L6.26678 16.9333C6.13345 16.8 6.03878 16.6555 5.98278 16.5C5.92678 16.3444 5.89967 16.1778 5.90145 16C5.90145 15.8222 5.92945 15.6555 5.98545 15.5C6.04145 15.3444 6.13523 15.2 6.26678 15.0667L15.0668 6.26666C15.3112 6.02222 15.617 5.89999 15.9841 5.89999C16.3512 5.89999 16.6677 6.02222 16.9334 6.26666C17.2001 6.53333 17.3334 6.85022 17.3334 7.21733C17.3334 7.58444 17.2001 7.90088 16.9334 8.16666L10.4334 14.6667H25.3335C25.7112 14.6667 26.0281 14.7947 26.2841 15.0507C26.5401 15.3067 26.6677 15.6231 26.6668 16C26.6668 16.3778 26.5388 16.6942 26.2828 16.9502C26.0268 17.2062 25.7103 17.3342 25.3335 17.3333H10.4334Z" fill="black" />
          </svg>
          <div className='w-full ml-6 text-lg font-medium relative right-3 float-end text-center'>Your Cart</div>
        </div>
        <ToastContainer style={{ top: '150px', width: '60%', float: 'right', position: 'fixed' }} position='top-right' />
        <div className='top-10 relative pb-16'>
          {orderres.length === 0 && !loading && (
            <div className='text-center relative top-[180px]'>Your cart is empty.</div>
          )}
          {orderres.length > 0 && orderres.map((item) => (
            <div className='border-b-2 border-gray-300 m-5 flex justify-between' key={item._id}>
              <div className='py-2'>
                <div className='text-lg font-medium'>{item.name}</div>
                <div className='text-sm'>Rs.{item.price}</div>
                <div className='text-sm'>Quantity : {item.quantity}</div>
              </div>
              <div>
                <div className='overflow-hidden w-20 h-20'>
                  <img className='object-cover' src={item.image} alt='' height={'104px'} width={'104px'} />
                </div>
                {counts[item._id] && (
                  <div key={item._id} className='bg-slate-100 flex gap-3 justify-evenly px-2 items-center hover:cursor-pointer relative bottom-5 h-8 w-20 rounded-full'>
                    {counts[item._id] <= 1 ? (
                      <button onClick={() => handleDelete(item._id)} className='hover:bg-gray-300 rounded-3xl h-[30px] w-[40px]'>
                        <img className='m-auto sm:h-5 h-4 sm:w-5 w-4' src={Delete} alt='' />
                      </button>
                    ) : (
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
      </div>
      {(summary || animating) && (
        <div>
          <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-10'></div>
          <div className={`fixed border-t-2 bottom-36 bg-white border-gray-200 w-full rounded-t-3xl z-20 transition-transform h-[450px] overflow-y-auto ${summary && !animating ? 'slide-up' : 'slide-down'} transition-transform duration-300`}>
            <div className='flex justify-end items-center my-1 mx-5'>
              <button onMouseDownCapture={handleClose} className='p-2 border rounded-full'>
                <img src={Close} alt="" height={'12px'} width={'12px'} />
              </button>
            </div>
            {orderres.length > 0 && orderres.map((item) => (
              <div className='m-5 flex justify-between' key={item._id}>
                <div className='py-2'>
                  <div className='text-lg font-medium'>{item.name}</div>
                  <div className='text-sm'>Rs.{item.price}</div>
                  <div className='text-sm'>Quantity : {item.quantity}</div>
                </div>
                <div>
                  <div className='overflow-hidden w-20 h-20'>
                    <img className='object-cover' src={item.image} alt='' height={'104px'} width={'104px'} />
                  </div>
                </div>
              </div>
            ))}
            <div>
              <p className='font-semibold w-full text-lg text-center pb-2 border-b border-b-gray-300'>Cart summary</p>
              <div className='my-5 mx-5 flex justify-between'>
                <p>
                  Total Amount
                </p>
                <p>
                  {calculateTotalPrice()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {orderres.length > 0 && showForm === false && (
        <div className='mx-5 z-20 flex flex-col gap-12 h-fit border-b mb-44'>
          <div className='flex fixed w-full bg-white border-t border-gray-200 
           h-24 px-5 left-0 gap-5 bottom-12'>
            <button onClick={() => { 
              if(summary===false){
                setSummary(true); 
              }else{
                setSummary(false); 
              }
              }} className='flex gap-2 items-center justify-center' onMouseDownCapture={handlesummarybtn}>
              <p>Summary</p>
              {!summary&&<img src={Up} alt="" height={'10px'} width={'10px'} />}
              {summary&&<img src={Down} alt="" height={'10px'} width={'10px'} />}
            </button>
            <button id='placeorder' onClick={() => { setShowForm(true);setSummary(false) }} className='w-full h-12 m-auto rounded-full text-lg font-semibold'>
              Checkout
            </button>
          </div>
        </div>
      )}
      {showForm && (
        <div className="fixed top-0 left-0 w-full  flex justify-center items-center">
          <div ref={formRef} className='flex justify-center'>
            <Form setcustomerdetails={handleCustomer} />
          </div>
        </div>
      )}
    </div>
  );
};

export default YourCart;
