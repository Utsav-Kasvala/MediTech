import React from 'react'
import useFetchData from '../../hooks/useFetchData'
import { BASE_URL } from '../../config'
import DoctorCard from './../../components/Doctors/DoctorCard'
import Loading from '../../components/Loader/Loading'
import Error from '../../Error/Error'

const MyBookings = () => {

    const { data: appointmnets, loading, error } = useFetchData(`${BASE_URL}/users/appointments/my-appointments`)
    return (
        <div>
            {
                loading && !error && <Loading />
            }

            {
                error && !loading && <Error errmessage={error} />
            }

            {
                !loading && !error && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {
                            appointmnets.map(doctor => (<DoctorCard doctor={doctor} key={doctor._id} />))
                        }
                    </div>
                )
            }

            {
                !loading && !error && appointmnets.length === 0 && (
                    <h2 className='mt-5 text-center  leading-7 text-[20px] font-semibold
            text-red-600'>You did not book any doctor</h2>
                )
            }
        </div>
    )
}

export default MyBookings
