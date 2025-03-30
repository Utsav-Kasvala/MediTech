import { useState, useContext } from "react"
import { BASE_URL, token } from '../../config'
import { toast } from 'react-toastify'
import { authContext } from '../../context/authContext'

const SidePanel = ({ doctorId, ticketPrice, timeSlots }) => {
  // Personalized convertTime function
  const convertTime = (timeStr) => {
    if (!timeStr) return "";
    const [hour, minute] = timeStr.split(':');
    let hourNum = parseInt(hour, 10);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    hourNum = hourNum % 12;
    if (hourNum === 0) hourNum = 12;
    return `${hourNum}:${minute} ${ampm}`;
  };

  // Get user from auth context
  const { user } = useContext(authContext)

  const bookingHandler = async (slot) => {
    try {
      const res = await fetch(`${BASE_URL}/bookings/checkout-session/${doctorId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ timeslot: slot, userId: user?._id }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message + ' Please try again');
      }

      if (data.session.url) {
        window.location.href = data.session.url;
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const [openPanel, setOpenPanel] = useState(false)
  const panelOpen = () => {
    setOpenPanel(!openPanel)
  }

  return (
    <>
      <div className="mb-2 flex items-center justify-center">
        <button onClick={panelOpen} className="border-2 border-solid border-black">
          Click to see Doctor's Availability
        </button>
      </div>
      {openPanel && (
        <div className='shadow-panelShadow p-3 lg:p-5 rounded-md'>
          <div className='flex items-center justify-between'>
            <p className='text_para mt-0 font-semibold'>CheckUp Price</p>
            <span className='text-[16px] leading-7 lg:text-[22px] lg:leading-8 text-headingColor font-bold'>
              {ticketPrice} Rs
            </span>
          </div>

          <div className='mt-[30px]'>
            <p className='text_para mt-0 font-semibold text-headingColor'>
              Available Time Slots:
            </p>
            <ul className='mt-3'>
              {timeSlots?.map((item, index) => (
                <li key={index} className='mb-4 border-b pb-2'>
                  <div className='flex flex-col gap-1'>
                    <p className='text-[15px] leading-6 text-textColor font-semibold'>
                      Date: {new Date(item.date).toLocaleDateString()}
                    </p>
                    <p className='text-[15px] leading-6 text-textColor font-semibold'>
                      {convertTime(item.startTime)} to {convertTime(item.endTime)}
                    </p>
                    <button
                      onClick={() => bookingHandler(item)}
                      className='cursor-pointer rounded-[30px] border-none bg-primaryColor pt-2 pb-2 px-4 mt-2 text-white'
                    >
                      Book Appointment
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  )
}

export default SidePanel