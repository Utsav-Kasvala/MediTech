import Doctor from '../models/DoctorSchema.js'
import Booking from '../models/BookingSchema.js'
import User from '../models/UserSchema.js'
import Stripe from 'stripe'

export const getCheckoutSession = async (req, res) => {
    try {
        // get currently booked doctor
        const doctor = await Doctor.findById(req.params.doctorId)
        const user = await User.findById(req.body.userId)

        const timeslot = req.body.timeslot

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: `${process.env.CLIENT_SITE_URL}/checkout-success`,
            cancel_url: `${req.protocol}://${req.get('host')}/doctors/${doctor.id}`,
            customer_email: user.email,
            client_reference_id: req.params.doctorId,
            line_items: [
                {
                    price_data: {
                        currency: 'bdt',
                        unit_amount: doctor.ticketPrice * 100,
                        product_data: {
                            name: doctor.name,
                        }

                    },
                    quantity: 1
                }
            ]
        })

        // Create new booking including the selected timeslot and session id
        const booking = new Booking({
            doctor: doctor._id,
            user: user._id,
            ticketPrice: doctor.ticketPrice,
            session: session.id,
            timeslot: timeslot
        })

        await booking.save()

        // Remove the booked timeslot from doctor's available timeSlots
        await Doctor.findByIdAndUpdate(doctor._id, {
            $pull: {
                timeSlots: {
                    date: new Date(timeslot.date),
                    startTime: timeslot.startTime,
                    endTime: timeslot.endTime
                }
            }
        })

        res.status(200).json({ success: true, message: 'Successfully Paid', session })

    } catch (error) {
        // console.log(error)
        res.status(500).json({ success: false, message: 'Error creating checkout session' });
    }
}