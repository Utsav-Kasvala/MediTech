import React from 'react'
import userImg from '../../assets/images/doctor-img01.png';
import { useContext } from 'react';
import {authContext} from './../../context/authContext'

const MyAccount = () => {

  const {dispatch} = useContext(authContext)

  const handleLogout =()=>{
    dispatch({type:"LOGOUT"})
  }


  return (
    <div className='max-w-[1170px] px-5 mx-auto'>
      <div className="grid md:grid-cols-3 gap-10">
        <div className="pb-[50px] px-[30px] rounded-md  bg-yellow-300 border-solid border-red-600 border-4 m-2">
          <div className="flex items-center justify-center">
            <figure className='w-[100px] h-[100px] rounded-full border-2 border-solid border-black'>
              <img src={userImg} alt="" className='w-full h-full rounded-full' />
            </figure>
          </div>
          <div className="text-center mt-4">
            <h3 className='text-[18px] leading-[30px] text-headingColor font-bold'>Solanki Nirmal Bhikhabhai</h3>
            <p className='text-textColor text-[15px] leading-6 font-medium'>example@gmail.com</p>
            <p className='text-textColor text-[15px] leading-6 font-medium'>Blood Type: <span className='ml-2 text-headingColor text-[22px] leading-8'>O+</span></p>
          </div>
          <div className="mt-[50px] md:mt-[100px]">
            <button onClick={handleLogout} className='w-full bg-[#181A1E] p-3 text-[16px] leading-7 rounded-md text-white'>Logout</button>
            <button className='w-full bg-red-600 mt-4 p-3 text-[16px] leading-7 rounded-md  text-white '>Delete Account</button>
          </div>
        </div>

        <div className="md:col-span-2 md:px-[30px] m-2">
          <div>
            <button className='p-2 mr-5 px-5 rounded-md text-headingColor font-semibold text-[16px] leading-7 border border-solid border-primaryColor focus:border-4 focus:outline-none focus:bg-black focus:text-white focus:border-lime-500'>My Bookings</button>

            <button className='py-2 px-5 rounded-md text-headingColor font-semibold text-[16px] leading-7 border border-solid border-primaryColor focus:border-4 focus:outline-none focus:bg-black focus:text-white focus:border-lime-500'>Profile Settings</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyAccount