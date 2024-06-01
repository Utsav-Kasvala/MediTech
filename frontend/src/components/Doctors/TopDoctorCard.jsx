import React from 'react';

const TopDoctorCard = ({ doctor }) => {
    const {name ,averageRating,totalRating,photo,specialization,experiences,ticketPrice}=doctor 
  return (
    <div className="border rounded-lg p-4 w-64 shadow-md hover:shadow-lg transition-shadow duration-300 bg-blue-200 m-4">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-800">{name}</h2>
        <img src={photo} className='w-full' alt="" /> 
        <p className="text-lg text-gray-800 mt-2">Rating: {averageRating} ⭐</p>
        <p className="text-lg text-gray-800 mt-2">TotalRating: 5 ⭐</p>
        <p className="text-lg text-gray-800 mt-2">Price: {ticketPrice} BDT</p>
      </div>
    </div>
  );
};

export default TopDoctorCard;
