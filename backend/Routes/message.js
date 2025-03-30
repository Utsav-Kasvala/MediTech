import express from "express";
import {authenticate} from './../auth/verifyToken.js'
import { messageController } from "../Controllers/messageController.js";


const router = express.Router();
router.get("/",messageController);


export default router;