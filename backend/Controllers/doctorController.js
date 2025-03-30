import Doctor from "../models/DoctorSchema.js";
import Booking from "../models/BookingSchema.js"

export const updateDoctor = async (req,res) =>{
    const id = req.params.id;

    try {

        const updatedDoctor = await Doctor.findByIdAndUpdate(
            id,
            {$set: req.body},
            {new: true}
        );

        res.status(200).json({
            success: true,
            message: "Successfully Updated",
            data: updatedDoctor,
        });
        
    } catch (err) {
        res.status(400).json({
            success: false,
            message: "Failed to update",
        });
    }
}

export const deleteDoctor = async (req,res) =>{
    const id = req.params.id;

    try {

        await Doctor.findByIdAndDelete(
            id

        );

        res.status(200).json({
            success: true,
            message: "Successfully deleted",
        });
        
    } catch (err) {
        res.status(400).json({
            success: false,
            message: "Failed to delete",
        });
    }
}

export const getSingleDoctor = async (req, res) => {
    const id = req.params.id;

    try {
        // Retrieve the doctor with reviews and exclude the password
        const doctor = await Doctor.findById(id).populate("reviews").select("-password");

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "No doctor found",
            });
        }

        // Get current date & time
        const currentDateTime = new Date();

        // Filter out timeslots whose combined date and startTime is before current time
        const filteredTimeSlots = doctor.timeSlots.filter(slot => {
            // Create a new Date using the slot's date
            const slotDateTime = new Date(slot.date);
            // Parse the startTime (expected format "HH:MM")
            const [hours, minutes] = slot.startTime.split(':').map(Number);
            // Set the hours and minutes on the slot date
            slotDateTime.setHours(hours, minutes, 0, 0);
            // Keep the slot if its datetime is equal or later than currentDateTime
            return slotDateTime >= currentDateTime;
        });

        // If the timeslots are updated, persist the change in the database
        if (filteredTimeSlots.length !== doctor.timeSlots.length) {
            doctor.timeSlots = filteredTimeSlots;
            await doctor.save();
        }

        res.status(200).json({
            success: true,
            message: "Doctor found",
            data: doctor,
        });
    } catch (err) {
        res.status(404).json({
            success: false,
            message: "No doctor found",
        });
    }
};

export const getAllDoctor = async (req,res) =>{
    

    try {

        const {query} = req.query;
        let doctors;
        if(query)
        {
            doctors = await Doctor.find({
                isApproved: "approved",
                $or: [
                    {name: {$regex : query, $options: "i"} },
                    {specialization: {$regex : query, $options: "i"} },
                ]
            }).select("-password");
        }else{
             doctors = await Doctor.find({isApproved: "approved"}).select("-password"); //It will exclude the password when you are sending the client the data of all users
        //It's obvious that we will not be sending the sensitive data.
        }
        res.status(200).json({
            success: true,
            message: "Doctors found", 
            data: doctors,
        });
        
    } catch (err) {
        res.status(404).json({
            success: false,
            message: "Not found",
        });
    }
}

export const getDoctorProfile = async (req, res) => {
    const doctorId = req.userId; // Alternatively, req.params.id if that's how you pass it
    try {
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor Not found' });
        }
        // Exclude password
        const { password, ...rest } = doctor._doc;

        // Delete appointments whose appointment date is before today's date
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        await Booking.deleteMany({ 
            doctor: doctorId, 
            "timeslot.date": { $lt: today }
        });

        // Retrieve remaining appointments
        const appointments = await Booking.find({ doctor: doctorId });
        res.status(200).json({
            success: true,
            message: 'Doctor Profile info is getting',
            data: { ...rest, appointments }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'something went wrong doctorprofile' });
    }
};

export const getTopDoctors = async (req,res)=>{
    try {
      // Fetch doctors sorted by averageRating in descending order
      const doctors = await Doctor.find({isApproved: "approved"}).sort({averageRating:-1}).select("-password");
  
      // Return the doctors as a JSON response
      res.status(200).json({
        success: true,
        message: "Doctors found",
        data:doctors
    });
    } 
    catch (err) {
        res.status(404).json({
            success: false,
            message: "Not found",
        });
    }

};
export const getTopDoctorsPrice = async (req,res)=>{
    try {
      // Fetch doctors sorted by averageRating in descending order
      const doctors = await Doctor.find({isApproved: "approved"}).sort({ticketPrice:-1}).select("-password");
  
      // Return the doctors as a JSON response
      res.status(200).json({
        success: true,
        message: "Doctors found",
        data:doctors
    });
    } 
    catch (err) {
        res.status(404).json({
            success: false,
            message: "Not found",
        });
    }

};
