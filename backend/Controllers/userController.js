import User from "../models/UserSchema.js";


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

        );

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

        const users = await User.findById(
            {}

        );

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