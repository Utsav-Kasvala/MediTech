import jwt from 'jsonwebtoken'
import Doctor from '../models/DoctorSchema.js'
import User from '../models/UserSchema.js'


//next for passing the flow to the next middleware
export const authenticate = async (req, res, next)=>{
    //get tokken from headers
    const authToken = req.headers.authorization

    //we expect token in the form like  'Bearer actual token
    //check if token exists or not

    if(!authToken || !authToken.startsWith("Bearer ")){
        return res.status(401).json({success:false, message: "No token, authorization denied"})
    }
    
    try {
        //console.log(authToken);
        const token = authToken.split(" ")[1];

        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

        req.userId = decoded.id
        req.role = decoded.role
        next();//must be call the  next function
    } catch (err) {
        // If token is expired 15 days
        if(err.name=='TokenExpiredError'){
            return res.status(401).json({message:'Token is Expired'}) ;
        }
         // Invalid token
        return res.status(401).json({success:false,message:'Invalid token'})
    }
}

export const restrict = roles=>async(req,res,next)=>{
     const userId = req.userId
     let user;

     const patient = await User.findById(userId);
     const doctor = await Doctor.findById(userId);

     if(patient){
        user=patient
     }
     if(doctor){
        user=doctor
     }
     if(!roles.includes(user.role)){
        return res.status(401).json({success:false,message:"You are not authorised"})
     }

     next();

} 