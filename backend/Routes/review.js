import express from "express"
import { getAllReviews,createReview } from "../Controllers/reviewController.js";
import {authenticate ,restrict} from './../auth/verifyToken.js'


const router= express.Router({mergeParams:true});   

// /doctor/doctorid
// we will use nested route

router.route('/').get(getAllReviews).post(authenticate,restrict(['patient']),createReview)


export default router