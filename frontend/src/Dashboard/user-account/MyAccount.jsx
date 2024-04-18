import React from 'react'
//import userImg from '../../assets/images/doctor-img01.png';
import { useContext, useState } from 'react';
import {authContext} from './../../context/authContext'
import MyBookings from './MyBookings';
import Profile from './Profile';
import useGetProfile from '../../hooks/useFetchData'
import { BASE_URL } from '../../config';
import Loading from '../../components/Loader/Loading';
import Error from '../../Error/Error';
const MyAccount = () => {

  const {dispatch} = useContext(authContext);

  const [tab,setTab] = useState('bookings')

  const {data: userData, loading, error} = useGetProfile(`${BASE_URL}/users/profile/me`)
  console.log(userData, 'userdata');

  const handleLogout =()=>{
    dispatch({type:"LOGOUT"})
  }


  return (
   <section>
     <div className='max-w-[1170px] px-5 mx-auto'>


      {
        loading && !error && <Loading/>
      }

      {
        error && !loading && <Error errmessage={error}/>
      }

      {
        !loading && !error && (<div className="grid md:grid-cols-3 gap-10">
        <div className="pb-[50px] px-[30px] rounded-md  bg-yellow-300 border-solid border-red-600 border-4 ">
          <div className="flex items-center justify-center">
            <figure className='w-[100px] h-[100px] rounded-full border-2 border-solid border-black mt-2'>
              <img src={userData.photo} alt="" className='w-full h-full rounded-full' />
            </figure>
          </div>
          <div className="text-center mt-4">
            <h3 className='text-[18px] leading-[30px] text-headingColor font-bold'>{userData.name}</h3>
            <p className='text-textColor text-[15px] leading-6 font-medium'>{userData.email}</p>
            <p className='text-textColor text-[15px] leading-6 font-medium'>Blood Type: <span className='ml-2 text-headingColor text-[22px] leading-8'>{userData.bloodType}</span></p>
          </div>
          <div className="mt-[50px] md:mt-[100px]">
            <button onClick={handleLogout} className='w-full bg-[#181A1E] p-3 text-[16px] leading-7 rounded-md text-white'>Logout</button>
            <button className='w-full bg-red-600 mt-4 p-3 text-[16px] leading-7 rounded-md  text-white '>Delete Account</button>
          </div>
        </div>

        <div className="md:col-span-2 md:px-[30px]">
          <div>
            <button onClick={()=>setTab('bookings')} className={`${tab==='bookings' && 'focus:border-4 focus:outline-none focus:bg-black focus:text-white focus:border-lime-500'} p-2 mr-5 px-5 rounded-md text-headingColor font-semibold text-[16px] leading-7 border border-solid border-primaryColor`}>My Bookings</button>

            <button onClick={()=>setTab('settings')} className={`${tab==='settings' && 'focus:border-4 focus:outline-none focus:bg-black focus:text-white focus:border-lime-500'} py-2 px-5 rounded-md text-headingColor font-semibold text-[16px] leading-7 border border-solid border-primaryColor`}>Profile Settings</button>
          </div>

          {
            tab==='bookings' && <MyBookings/>
          }
          {
            tab==='settings' && <Profile user={userData}/>
          }


        </div>
      </div>)
      }
    </div>
   </section>
  )
}

export default MyAccount