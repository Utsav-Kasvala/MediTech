//import React from 'react'

import { useState } from "react"
import { AiFillGoogleCircle } from "react-icons/ai"
import { Link } from "react-router-dom"
const Login = () => {
  const [formdata, setFormData] = useState({
    email:'',
    password:'',
  })
  const handleInputChange= e=>{
    setFormData({...formdata, [e.target.name]:e.target.value})
  }
  return (
    <section className="px-5 lg:px-0">
      <div className="w-full max-w-[570px] mx-auto rounded-lg shadow-md md:p-10">
        <h3 className="text-headingColor text-[22px] leading-9 font-bold mb-10">Hello👋 <span className="text-primaryColor">Welcome</span> Back🎉</h3>

        <form className="py-4 md:py-0">
        <div className="mb-5">
          <input 
          type="email" 
          placeholder="Enter Your Email" 
          name="email" 
          value={formdata.email} 
          onChange={handleInputChange}
          className="w-full px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor focus:border-b-4 text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
          required
          />
        </div>

        <div className="mb-5">
          <input 
          type="password" 
          placeholder="Password" 
          name="password" 
          value={formdata.password} 
          onChange={handleInputChange}
          className="w-full px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor focus:border-b-4 text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
          required
          />
        </div>

        <div className="mt-7 flex  flex-col items-center justify-center">
          <button type="submit" className="w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-2">
            Login
          </button>
          <span className="text-[14px] mt-3 mb-3 font-serif">OR</span>
          {/*type="submit" */}<button className="w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-2 flex justify-center gap-2">
            <AiFillGoogleCircle className="text-[30px]"/> Login with google
          </button>
        </div>

        <p className="mt-5 text-textColor text-center">Don&apos;t have an Account? 👉<Link to='/register' className="text-primaryColor font-medium ml-1 border border-solid border-primaryColor rounded-md px-1 py-1"> Register</Link></p>
      </form>
      </div>
    </section>
  )
}

export default Login