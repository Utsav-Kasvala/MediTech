import User from "../models/UserSchema.js";
import Booking from "../models/BookingSchema.js"
import Doctor from "../models/DoctorSchema.js"

export const updateUser = async (req,res) =>{
    const id = req.params.id;

    try {

        const updatedUser = await User.findByIdAndUpdate(
            id,
            {$set: req.body},
            {new: true}
        );

        res.status(200).json({
            success: true,
            message: "Successfully Updated",
            data: updatedUser,
        });
        
    } catch (err) {
        res.status(400).json({
            success: false,
            message: "Failed to update",
        });
    }
}

export const deleteUser = async (req,res) =>{
    const id = req.params.id;

    try {

        await User.findByIdAndDelete(
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

export const getSingleUser = async (req,res) =>{
    const id = req.params.id;

    try {

        const user = await User.findById(
            id

        ).select("-password");

        res.status(200).json({
            success: true,
            message: "User found",
            data: user,
        });
        
    } catch (err) {
        res.status(404).json({
            success: false,
            message: "No user found",
        });
    }
}

export const getAllUser = async (req,res) =>{
    

    try {

        const users = await User.find({}).select("-password"); //It will exclude the password when you are sending the client the data of all users
        //It's obvious that we will not be sending the sensitive data.

        res.status(200).json({
            success: true,
            message: "Users found",
            data: users,
        });
        
    } catch (err) {
        res.status(404).json({
            success: false,
            message: "Not found",
        });
    }
}


export const getUserProfile= async(req,res)=>{
    const userId=req.userId
    try {
       const user= await User.findById(userId) 
        if(!user){
        return res.status(404).json({success:false,message:'User Not found'})
    }
        // excldind password to bee sent
        const {password,...rest}=user._doc
        res.status(200).json({success:true,message:'Profile is info is getting',data:{...rest}})
    } 
    catch (error) {
        res.status(500).json({success:false,message:'something went wrong userprofile'})
    }
};

export const getMyAppointments=async(req,res)=>{
    try {
        // step1 retrive appointment from booking
     const bookings=await Booking.find({user:req.userId})

     // step2 extract doctor id from the appointments
      const doctorIds=  bookings.map(el=>el.doctor.id)
 
     //step 3 retrieve doctors using extracted doctors id
      const doctors= await Doctor.find({_id:{$in:doctorIds}}).select('-password') // excluding doctors password
 
      res.status(200).json({success:true,message:'Appointments are getting',data:doctors});
        
    } catch (error) {
        res.status(500).json({success:false,message:'something went wrong appointments'})
    }
    
    
}