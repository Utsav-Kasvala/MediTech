import React, { useState } from 'react'

const Profile = () => {

const [formData,setFormData]=useState({
    name:"",
    email:"",
    phone:"",
    bio:""
})
const handleInputChange=e=>{

}
  return (
    <div>
        <h2 className='text-headingColor font-bold text-[24px]'>Profile Information</h2>

        <form>
            <div className='mb-5'>
                <p className='form_label'>Name*</p>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder='Full Name' className='form_input'/>
            </div>
            <div className='mb-5'>
                <p className='form_label'>Email*</p>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder='E-mail' className='form_input' readOnly aria-readonly disabled='true'/>
            </div>
            <div className='mb-5'>
                <p className='form_label'>Phone*</p>
                <input type="number" name="phone" value={formData.phone} onChange={handleInputChange} placeholder='PhoneHolder' className='form_input'/>
            </div>
            <div className='mb-5'>
                <p className='form_label'>Bio*</p>
                <input type="text" name="bio" value={formData.bio} onChange={handleInputChange} placeholder='Bio' className='form_input' maxLength={100}/>
            </div>
        </form>
    </div>
  )
}

export default Profile