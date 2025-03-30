import React from 'react'
import { formateDate } from '../../utils/formateDate'

const Appointments = ({ appointments }) => {
  return (
    <table className='w-full text-left text-sm text-gray-500'>
      <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
        <tr>
          <th scope="col" className='px-6 py-3'>User</th>
          <th scope="col" className='px-6 py-3'>Gender</th>
          <th scope="col" className='px-6 py-3'>Payment</th>
          <th scope="col" className='px-6 py-3'>Price</th>
          <th scope="col" className='px-6 py-3'>Appointment Date</th>
          <th scope="col" className='px-6 py-3'>Start Time</th>
          <th scope="col" className='px-6 py-3'>End Time</th>
          <th scope="col" className='px-6 py-3'>Booked On</th>
        </tr>
      </thead>
      <tbody>
        {appointments.map(item => (
          <tr key={item._id}>
            <td className='flex items-center px-6 py-4 whitespace-nowrap'>
              {item.user?.photo && (
                <img 
                  src={item.user.photo} 
                  className='w-10 h-10 rounded-full mr-3' 
                  alt="User Profile" 
                />
              )}
              <div>
                <div className='text-base font-semibold'>{item.user?.name}</div>
                <div className='text-normal text-gray-500'>{item.user?.email}</div>
              </div>
            </td>
            <td className='px-6 py-4'>
              {item.user?.gender || '-'}
            </td>
            <td className='px-6 py-4'>
              {item.isPaid ? (
                <div className='flex items-center gap-1'>
                  <div className='h-2.5 w-2.5 mt-1 rounded-full bg-green-500'></div>
                  <div>Paid</div>
                </div>
              ) : (
                <div className='flex items-center gap-1'>
                  <div className='h-2.5 w-2.5 mt-1 rounded-full bg-red-500'></div>
                  <div>Unpaid</div>
                </div>
              )}
            </td>
            <td className='px-6 py-4'>
              {item.ticketPrice}
            </td>
            <td className='px-6 py-4'>
              {formateDate(item.timeslot.date)}
            </td>
            <td className='px-6 py-4'>
              {item.timeslot.startTime}
            </td>
            <td className='px-6 py-4'>
              {item.timeslot.endTime}
            </td>
            <td className='px-6 py-4'>
              {formateDate(item.createdAt)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Appointments