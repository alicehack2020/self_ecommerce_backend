import express from "express"
const router = express.Router();

import EventController from "../controllers/eventController.js";
import checkUserAuth from "../middlewares/auth-middleware.js";
router.post('/add',checkUserAuth,EventController.addEvent);
router.post('/list',checkUserAuth,EventController.eventList);

export default router;