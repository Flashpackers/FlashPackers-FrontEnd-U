import React, { useState } from 'react';
interface FormProp {
  setcustomerdetails: React.Dispatch<React.SetStateAction<object>>;
}

const Form: React.FC<FormProp> = ({ setcustomerdetails }) => {
  const [disable, setDisable] = useState<boolean>(false)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'name') {
      setName(value);
      setNameError('');
    } else if (name === 'email') {
      setEmail(value);
      setEmailError('');
    } else if (name === 'phone') {
      setPhone(value);
      setPhoneError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setNameError('Please enter your name');
    } else if (!/^[A-Za-z ]+$/.test(name)) {
      setNameError('Please enter a valid name');
    }

    if (!email.trim()) {
      setEmailError('Please enter your email');
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError('Please enter a valid email address');
    }

    if (!phone.trim()) {
      setPhoneError('Please enter your phone number');
    } else if (!/^\d+$/.test(phone)) {
      setPhoneError('Please enter a valid phone number');
    }

    if (name.trim() && /^[A-Za-z ]+$/.test(name) && email.trim() && /^\S+@\S+\.\S+$/.test(email) && phone.trim() && /^\d+$/.test(phone)) {
      setcustomerdetails({ 'customerName': name, 'customerEmail': email, 'customerPhoneNumber': phone });
      setDisable(true);
    }
  };

  return (
    <div className='fixed bottom-12 w-[95%] bg-white rounded-lg border border-gray-200 p-5'>
      <div className='flex justify-center'>
        <p className='font-semibold text-lg'>
          Enter Your Details
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label className='block text-sm font-semibold mb-2' htmlFor='name'>
            Name
          </label>
          <input
            className='border border-gray-400 rounded-md w-full py-2 px-3'
            id='name'
            type='text'
            name='name'
            value={name}
            onChange={handleChange}
            placeholder='Your name'
          />
          {nameError && <p className='text-red-500 text-xs mt-1'>{nameError}</p>}
        </div>
        <div className='mb-4'>
          <label className='block text-sm font-semibold mb-2' htmlFor='email'>
            Email
          </label>
          <input
            className='border border-gray-400 rounded-md w-full py-2 px-3'
            id='email'
            type='email'
            name='email'
            value={email}
            onChange={handleChange}
            placeholder='Your email'
          />
          {emailError && <p className='text-red-500 text-xs mt-1'>{emailError}</p>}
        </div>
        <div className='mb-4'>
          <label className='block text-sm font-semibold mb-2' htmlFor='phone'>
            Contact no.
          </label>
          <input
            className='border border-gray-400 rounded-md w-full py-2 px-3'
            id='phone'
            type='tel'
            name='phone'
            value={phone}
            onChange={handleChange}
            placeholder='Your contact no.'
          />
          {phoneError && <p className='text-red-500 text-xs mt-1'>{phoneError}</p>}
        </div>
        <div className='flex items-center justify-between'>
          {disable === false
            && <button style={{ background: 'var(--bg-color)' }} className='text-white font-bold py-2 px-4 rounded-md' type='submit'>
              Place Order
            </button>}
          {disable === true && <p className='font-semibold' style={{ color: 'var(--bg-color)' }}>submitted</p>}
        </div>
      </form>
    </div>
  );
};

export default Form;
