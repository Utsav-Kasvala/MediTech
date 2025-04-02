import express from "express";
import {authenticate} from './../auth/verifyToken.js'
import { getconversation,getdoctorconversation } from "../Controllers/conversationController.js";


const router = express.Router();

router.get("/",getconversation);
router.get('/doctor/:doctorId', getdoctorconversation);

export default router;