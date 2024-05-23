import express from "express"
import cookieParser from "cookie-parser"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"
import authRoute from './Routes/auth.js'
import userRoute from './Routes/user.js'
import doctorRoute from './Routes/doctor.js'
import  reviewRoute from './Routes/review.js'
//import Doctor from "./models/DoctorSchema.js"
import bookingRoute  from './Routes/booking.js'
dotenv.config()

const app = express()
const port = process.env.PORT || 8000

const corsOptions={
    origin: 'https://medi-tech-frontend.vercel.app',
    credentials:true,
    secure:true,
    sameSite:'none'
};

app.get('/',(req,res)=>{
    res.send("API is Working");
});

mongoose.get('strictQuery',false)

const connectDB = async () => {
    try {
        // Connect to MongoDB without specifying any options
        await mongoose.connect(process.env.MONGO_URL);
        console.log('MongoDB database connected');
    } catch (err) {
        console.error('MongoDB database not connected:', err);
    }
};




//middleware
app.use(express.json());  
app.use(cookieParser());
app.use(cors(corsOptions));


// app.get('/topdoctors', async (req, res) => {
//     try {
//       // Fetch doctors sorted by averageRating in descending order
//       const doctors = await Doctor.find().sort({ averageRating: -1 });
  
//       // Return the doctors as a JSON response
//       res.json(doctors);
//     } catch (error) {
//       res.status(500).json({ message: 'An error occurred', error });
//     }
//   });
  
app.use('/api/v1/auth',authRoute);
app.use('/api/v1/users',userRoute);
app.use('/api/v1/doctors',doctorRoute);
app.use('/api/v1/reviews',reviewRoute);
app.use('/api/v1/bookings',bookingRoute);



app.listen(port,()=>{
    connectDB();
    console.log("Server is running on port" +port)
});