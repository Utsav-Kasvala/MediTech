import React, { useEffect, useState } from 'react';

const TopDoctors= () => {
  const [doctors, setDoctors] = useState([]);

  let data=fetch('/topdoctors').then(response => response.json());
  console.log(data);
  return (
    <div>
      <h1>Top Doctors List</h1>
      <ul>
        
      </ul>
    </div>
  );
};

export default TopDoctors;
