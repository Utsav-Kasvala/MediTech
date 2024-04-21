//import React from 'react'

import { useState } from "react"

const SidePanel = () => {

  const [openPanel,setOpenPanel]=useState(false)
  const panelOpen = ()=>{
    setOpenPanel(!openPanel)
  }
    return (<>
    <div className="mb-2 flex items-center justify-center"><button onClick={panelOpen} className="border-2 border-solid border-black">Click to see Doctor's Availability</button></div>
    {openPanel && <div className='shadow-panelShadow p-3 lg:p-5 rounded-md'>
    <div className='flex items-center justify-between'>
        <p className='text_para mt-0 font-semibold'>CheckUp Price</p>
        <span className='text-[16px] leading-7 lg:text-[22px] lg:leading-8 text-headingColor font-bold'>500 Rs</span>
    </div>

    <div className='mt-[30px]'>
      <p className='text_para mt-0 font-semibold text-headingColor'>
        Available Time Slots:
      </p>
      <ul className='mt-3'>
        <li className='flex items-center justify-between mb-2'>
          <p className='text-[15px] leading-6 text-textColor font-semibold'>
            Sunday
          </p>
          <p className='text-[15px] leading-6 text-textColor font-semibold'>3:00 P.M. to 10:45 P.M.</p>
        </li>
        <li className='flex items-center justify-between mb-2'>
          <p className='text-[15px] leading-6 text-textColor font-semibold'>
            Tuesday
          </p>
          <p className='text-[15px] leading-6 text-textColor font-semibold'>2:00 P.M. to 8:15 P.M.</p>
        </li>
        <li className='flex items-center justify-between mb-2'>
          <p className='text-[15px] leading-6 text-textColor font-semibold'>
            Thursday
          </p>
          <p className='text-[15px] leading-6 text-textColor font-semibold'>3:00 P.M. to 10:45 P.M.</p>
        </li>
        <li className='flex items-center justify-between mb-2'>
          <p className='text-[15px] leading-6 text-textColor font-semibold'>
            Friday
          </p>
          <p className='text-[15px] leading-6 text-textColor font-semibold'>2:00 P.M. to 8:15 P.M.</p>
        </li>
      </ul>
    </div>
    {/*btn px-2 w-full rounded-md */}
    <button className='cursor-pointer rounded-[30px] border-none bg-primaryColor pt-2 pb-2 items-center px-2 mt-[30px] mb-2 w-full text-white'>Book Appointment</button>
</div>}</>
      
    )
  }
  
  export default SidePanel