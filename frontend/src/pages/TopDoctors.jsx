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
import DoctorCard from '../components/Doctors/DoctorCard';
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
   <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 lg-gap-[30px] mt-[30px] lg:mt-[55px]'>{doctors.map((doctor)=><DoctorCard key={doctor._id} doctor={doctor}/>)}</div>}
    </>
  )
}

export default DoctorList