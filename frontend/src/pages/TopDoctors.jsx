// import React, { useEffect, useState } from 'react';

// const TopDoctors= () => {
//   const [doctors, setDoctors] = useState([]);

//   let data=fetch('/topdoctors').then(response => response.json());
//   console.log(data);
//   return (
//     <div>
//       <h1>Top Doctors List</h1>
//       <ul>
        
//       </ul>
//     </div>
//   );
// };

// export default TopDoctors;
import React from 'react'
// import {doctors} from './../../assets/data/doctors';
import TopDoctorCard from '../components/Doctors/TopDoctorCard.jsx';
import { BASE_URL } from '../config';
import useFetchData from '../hooks/useFetchData';
import Loader from '../components/Loader/Loading'
import Error   from '../Error/Error';
const DoctorList = () => {
  const {data:doctors,loading,error}=useFetchData(`${BASE_URL}/doctors/top/doctors`);
  return (<>
    {loading && <Loader/>}
    {error && <Error/>}
   { !loading && !error &&
   <div className='flex flex-col items-center justify-center'>{doctors.map((doctor)=><TopDoctorCard key={doctor._id} doctor={doctor}/>)}</div>}
    </>
  )
}

export default DoctorList
// import React, { useState } from 'react'
// // import {doctors} from './../../assets/data/doctors';
// import TopDoctorCard from '../components/Doctors/TopDoctorCard.jsx';
// import { BASE_URL } from '../config';
// import useFetchData from '../hooks/useFetchData';
// import Loader from '../components/Loader/Loading'
// import Error   from '../Error/Error';
// const TopDoctor = () => {
//   const {data:doctors,loading,error}=useFetchData(`${BASE_URL}/doctors/top/doctors`);
//   const {data:doctors2,loading2,error2}=useFetchData(`${BASE_URL}/doctors/top/doctors/sorted/price`);
//   const [byRate,setByRate] = useState(false);
//   const [byPrice,setByPrice] = useState(false);
//   return (<>
//   <div className='flex justify-center items-center'>
//             <button onClick={setByRate(!byRate)} className='focus:border-4 focus:outline-none focus:bg-black focus:text-white focus:border-lime-500 p-2 mr-5 px-5 rounded-md text-headingColor font-semibold text-[16px] leading-7 border border-solid border-primaryColor'>Sort By Rating</button>

//             <button onClick={setByPrice(!byPrice)} className='focus:border-4 focus:outline-none focus:bg-black focus:text-white focus:border-lime-500 py-2 px-5 rounded-md text-headingColor font-semibold text-[16px] leading-7 border border-solid border-primaryColor'>Sort By Price</button>
//   </div>
//     {loading && <Loader/>}
//     {error && <Error/>}
//    { !loading && !error && byRate &&
//    <div className='flex flex-col items-center justify-center'>{doctors.map((doctor)=><TopDoctorCard key={doctor._id} doctor={doctor}/>)}</div>}
//     </>
//   )
// }

// export default TopDoctor