import { useState } from 'react';
import { useParams } from 'react-router-dom';
import ChatSection from './ChatSection';
import DoctorAbout from './DoctorAbout';
import Feedback from './Feedback';
import SidePanel from './SidePanel';
import { BASE_URL } from '../../config';
import useFetchData from '../../hooks/useFetchData';
import Loader from '../../components/Loader/Loading';
import Error from '../../Error/Error';
import { useContext } from 'react';
import { authContext } from '../../context/authContext';
const DoctorDetails = () => {
  const [tab, setTab] = useState('about');
  const { id: doctorId } = useParams();
  
  const {user}=useContext(authContext)
  const userId=user?._id
  const { data: doctor, loading, error } = useFetchData(`${BASE_URL}/doctors/${doctorId}`);

  return (
    <section>
      <div className='max-w-[1170px] px-5 mx-auto'>
        {loading && <Loader />}
        {error && <Error />}
        {!loading && !error && (
          <div className='grid md:grid-cols-3 gap-[50px]'>
            <div className='md:col-span-2'>
              <div className='flex items-center gap-5'>
                <figure className='max-w-[200px] max-h-[200px]'>
                  <img src={doctor.photo} alt="" className='w-full' />
                </figure>
                <div>
                  <span className='bg-[#CCF0F3] text-irisBlueColor py-1 px-6 font-semibold rounded'>
                    {doctor.specialization}
                  </span>
                  <h3 className='text-headingColor text-[22px] font-bold mt-3'>Dr {doctor.name}</h3>
                </div>
              </div>
              <div className='mt-[50px] border-b border-solid border-[#0066ff34]'>
                <button onClick={() => setTab('about')} className={`${tab === 'about' ? 'bg-indigo-100' : 'bg-transparent'} py-2 px-5 mr-5 font-semibold`}>About</button>
                <button onClick={() => setTab('feedback')} className={`${tab === 'feedback' ? 'bg-indigo-100' : 'bg-transparent'} py-2 px-5 mr-5 font-semibold`}>Feedback</button>
                <button onClick={() => setTab('chat')} className={`${tab === 'chat' ? 'bg-indigo-100' : 'bg-transparent'} py-2 px-5 mr-5 font-semibold`}>Chat</button>
              </div>

              <div className='mt-[50px]'>
                {tab === 'about' && <DoctorAbout {...doctor} />}
                {tab === 'feedback' && <Feedback reviews={doctor.reviews} totalRating={doctor.totalRating} />}
                {tab === 'chat' && <ChatSection doctorId={doctorId} userId={userId} />}
              </div>
            </div>

            <div>
              <SidePanel doctorId={doctorId} ticketPrice={doctor.ticketPrice} timeSlots={doctor.timeSlots} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DoctorDetails;
