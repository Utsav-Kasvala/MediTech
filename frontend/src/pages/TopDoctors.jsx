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