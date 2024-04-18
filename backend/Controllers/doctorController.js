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

export const getSingleDoctor = async (req,res) =>{
    const id = req.params.id;

    try {

        const doctor = await Doctor.findById(
            id

        ).populate("reviews").select("-password");

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
}

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

export const getDoctorProfile= async(req,res)=>{
    const doctorId=req.userId // I think req.params.id
    try {
       const doctor= await Doctor.findById(doctorId) 
    if(!doctor){
        return res.status(404).json({success:false,message:'Doctor Not found'})
    }
        // excluding password to bee sent
        const {password,...rest}=doctor._doc
        const appointments=await Booking.find({doctor:doctorId})
        res.status(200).json({success:true,message:'Doctor Profile is info is getting',data:{...rest,appointments}})
    } 
    catch (error) {
        res.status(500).json({success:false,message:'something went wrong doctorprofile'})
    }
};