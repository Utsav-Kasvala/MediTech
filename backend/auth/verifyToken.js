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
        next();//must be call the next function
    } catch (err) {
        
    }
}
