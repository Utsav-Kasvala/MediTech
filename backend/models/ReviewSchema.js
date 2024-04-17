import mongoose from "mongoose";
import Doctor from './DoctorSchema.js'
const reviewSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Types.ObjectId,
      ref: "Doctor",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    reviewText: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  { timestamps: true }
);

// this middle ware gets executed everytime new review is created
reviewSchema.pre(/^find/,function (next){
  this.populate({
    path:"user",
    select:"name photo"
  })
  next(); 
});

reviewSchema.statics.calcAverageRatings = async function(doctorId){
   // this points the current review
   // mongodb pipeline aggregate
    const stats=await this.aggregate([{
      $match:{doctor:doctorId},

    },
  {
    $group:{
      _id:'$doctor',
      numberofRating:{$sum:1},
      avgRating:{$avg:'$rating'}
    }
  }]);
   //console.log(stats[0].numberofRating,stats[0].avgRating);
  let doctor= await Doctor.findByIdAndUpdate(doctorId,{
    totalRating: stats[0].numberofRating,
    averageRating: stats[0].avgRating,
  });
  console.log(doctor);
}

reviewSchema.post('save',function(){
  this.constructor.calcAverageRatings(this.doctor)
})
export default mongoose.model("Review", reviewSchema);
