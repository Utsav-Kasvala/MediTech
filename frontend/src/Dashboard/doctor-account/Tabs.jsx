import {useContext} from 'react'
import {BiMenu} from 'react-icons/bi'
import { authContext } from '../../context/authContext'
import useGetProfile from '../../hooks/useFetchData'
import {useNavigate, useParams} from 'react-router-dom'
import { BASE_URL, token } from '../../config'
import { toast } from 'react-toastify'
import useFetchData from '../../hooks/useFetchData'
const Tabs = ({tab,setTab}) => {

 const {dispatch} =useContext(authContext);
 const navigate=useNavigate()

 const handleLogout =()=>{
  dispatch({type:"LOGOUT"})
}

  const { data: doctor, loading, error } = useFetchData(`${BASE_URL}/doctors/profile/me`);
  console.log(doctor)

const handleDelete = async ()=>{
  dispatch({type:"LOGOUT"})
  try{
  const res= await fetch(`${BASE_URL}/doctors/${doctor._id}`,{
  method:'delete',
  headers:{
    Authorization:`Bearer ${token}`
  }
  })
  console.log(res);
  toast.success("Sucessfully Deleted")
}
  catch (err) {
    toast.error(err.message)
  }
}

  return (
    <div>
       <span className='lg:hidden'><BiMenu className='w-6 h-6 cursor-pointer'/></span> 
        <div className='hidden lg:flex flex-col p-[30px] bg-white shadow-panelShadow items-center h-max rounded-md'>
           <button  onClick={()=>setTab('appointments')} className={`${tab=='appointments' ? "bg-indigo-100 text-primaryColor": "bg-transparent text-headingColor"} w-full btn mt-0 rounded-md`}>Appointments</button>
           <button onClick={()=>setTab('overview')} className={`${tab=='overview' ? "bg-indigo-100 text-primaryColor": "bg-transparent text-headingColor"} w-full btn mt-0 rounded-md`}>Overview</button>
           <button onClick={()=>setTab('settings')} className={`${tab=='settings' ? "bg-indigo-100 text-primaryColor": "bg-transparent text-headingColor"} w-full btn mt-0 rounded-md`}>Profile</button>
           <button onClick={()=>setTab('chats')} className={`${tab=='chats' ? "bg-indigo-100 text-primaryColor": "bg-transparent text-headingColor"} w-full btn mt-0 rounded-md`}>Chats</button>
           
           <div className="mt-[100px] w-full">
            <button onClick={handleLogout} className='w-full bg-[#181A1E] p-3 text-[16px] leading-7 rounded-md text-white'>Logout</button>
            <button onClick={handleDelete} className='w-full bg-red-600 mt-4 p-3 text-[16px] leading-7 rounded-md  text-white '>Delete Account</button>
          </div>
        </div>
    </div>
  )
}

export default Tabs