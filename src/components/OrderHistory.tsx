import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from './../assets/spinner.svg';

interface OrderItem {
    _id: string;
    customer: string;
    orderDateTime: string;
    orderItems: OrderItemDetail[];
    orderStatus: string;
    totalAmount: number;
}

interface OrderItemDetail {
    id: string;
    name: string;
    image: string;
    quantity: number;
}

interface UserInfo {
    customerName: string;
    customerEmail: string;
    customerPhoneNumber: string;
}
interface OrderHiistoryProps {
    handleBack: () => void; 
}

const OrderHistory: React.FC<OrderHiistoryProps> = ({ handleBack }) => {
    const link: string = `https://flashpackers-backend-u.onrender.com/`;
    const [userinfo, setUserInfo] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(false);
    const [pastorder, setPastOrder] = useState<OrderItem[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchInfo = async (userInfo: UserInfo) => {
        try {
            setLoading(true);
            const { customerName, customerEmail, customerPhoneNumber } = userInfo;
            const response = await axios.post(`${link}api/order/orderHistory`, {
                customerName,
                customerEmail,
                customerPhoneNumber
            });
            setPastOrder(response.data);
            setLoading(false);
        } catch (error) {
            setError("Can't fetch the customer info.");
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userinfo) {
            fetchInfo(userinfo);
        }
    }, [userinfo]);

    useEffect(() => {
        const customerDetails = localStorage.getItem('customerDetails');
        if (customerDetails) {
            try {
                const customerDetailsObject: UserInfo = JSON.parse(customerDetails);
                setUserInfo(customerDetailsObject);
            } catch (error) {
                setError("Failed to parse customer details.");
            }
        }
    }, []);

    return (
        <div className='absolute top-44 w-full'>
            <div className='flex w-full fixed items-end pb-3 backdrop-blur-md z-10 h-20 top-16'>
                <svg onClick={handleBack} className='cursor-pointer relative left-3' width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.4334 17.3333L16.9668 23.8667C17.2334 24.1333 17.3614 24.4444 17.3508 24.8C17.3401 25.1556 17.201 25.4667 16.9334 25.7333C16.6668 25.9778 16.3557 26.1058 16.0001 26.1173C15.6446 26.1289 15.3334 26.0009 15.0668 25.7333L6.26678 16.9333C6.13345 16.8 6.03878 16.6555 5.98278 16.5C5.92678 16.3444 5.89967 16.1778 5.90145 16C5.90145 15.8222 5.92945 15.6555 5.98545 15.5C6.04145 15.3444 6.13523 15.2 6.26678 15.0667L15.0668 6.26666C15.3112 6.02222 15.617 5.89999 15.9841 5.89999C16.3512 5.89999 16.6677 6.02222 16.9334 6.26666C17.2001 6.53333 17.3334 6.85022 17.3334 7.21733C17.3334 7.58444 17.2001 7.90088 16.9334 8.16666L10.4334 14.6667H25.3335C25.7112 14.6667 26.0281 14.7947 26.2841 15.0507C26.5401 15.3067 26.6677 15.6231 26.6668 16C26.6668 16.3778 26.5388 16.6947 26.2828 16.9507C26.0268 17.2067 25.7103 17.3342 25.3335 17.3333H10.4334Z" fill="black" />
                </svg>
                <div className='w-full ml-6 text-lg font-medium relative right-3 float-end text-center'>Order History</div>
            </div>

            <div className='flex flex-col w-full relative bottom-12 items-center px-5'>
                {loading ? (
                    <div className='flex justify-center text-center relative top-44'>
                        <img src={Loading} alt="Loading" height={'100px'} width={'100px'} />
                    </div>
                ) : userinfo === null || pastorder.length === 0 ? (
                    <div className='flex justify-center'>
                        <div className='text-md font-normal relative top-[188px]'>No History</div>
                    </div>
                ) : (
                    pastorder.map((item) => (
                        <div className='border-b-2 flex flex-col w-full p-2 border-b-gray-400 m-5' key={item._id}>
                            <div className='block h-fit'>
                                <div className='text-lg font-semibold'>{new Date(item.orderDateTime).toLocaleString()}</div>
                            </div>
                            <div className='flex flex-col'>
                                {item.orderItems && item.orderItems.map((orderItem) => (
                                    <div key={orderItem.id} className='flex items-center justify-between border-b-2 border-b-gray-300 w-full mb-5'>
                                        <div>
                                            <div className='text-lg font-medium'>{orderItem.name}</div>
                                            <div className='text-sm'>Quantity: {orderItem.quantity}</div>
                                        </div>
                                        <img src={orderItem.image} alt={orderItem.name} className='w-16 h-16 mb-4 object-cover' />
                                    </div>
                                ))}
                            </div>
                            <div className='text-lg font-semibold'>Total amount: Rs.{item.totalAmount}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default OrderHistory;
